import React, { Component } from 'react';

// Form helper
const form = {
    group: function(data, groupby, id, template) {
        let res = {};
        let catGroups = {};
        let groups = [];

        data.forEach(function(row) {
            let rowid = row[id];
            let rowGroup = row[groupby];

            res[rowid] = row;

            if (!catGroups.hasOwnProperty(rowGroup)) {
                catGroups[rowGroup] = [];
            }

            catGroups[rowGroup].push(row);
        });

        Object.keys(catGroups).forEach((key) => {
            let options = [];

            catGroups[key].forEach(function(option) {
                let optionid = option[id];
                let name = form.optionName(option, template);

                options.push(
                    <option key={ `option-${name}` } value={ optionid }>{ name }</option>
                );
            })

            groups.unshift(
                <optgroup key={ `group-${key}` } label={ key }>
                    { options }
                </optgroup>
            );
        });

        return {
            data: res,
            groups: groups
        }
    },
    optionName: function(option, template) {
        let optionNames = [];
        let names = template.split(",");
        let word = /^[A-Za-z].*[A-Za-z]$/i;
        let special = /^(\(|\-|\/)(\w+)(\)?|\-?)/i;

        names.forEach(function(name) {
            if (name.match(word)) {
                optionNames.push(option[name]);
            } else {
                let sName = name.match(special);
                let start = sName[1];
                let str = sName[2];
                let last = sName[3];

                optionNames.push(start + option[str] + last);
            }
        });

        return optionNames.join(" ");
    }
};

export default form;
