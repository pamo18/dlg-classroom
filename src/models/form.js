import React, { Component } from 'react';

// Form helper
const form = {
    organize: function(data, groupby, id) {
        let res = {};
        let catGroups = {};

        data.forEach(function(row) {
            let rowid = row[id];

            let rowGroup = row[groupby];

            res[rowid] = row;

            if (!catGroups.hasOwnProperty(rowGroup)) {
                catGroups[rowGroup] = [];
            }

            catGroups[rowGroup].push(row);
        });

        return {
            data: res,
            groups: catGroups
        }
    },
    group: function(catGroups, id, template, selected, skip = null) {
        let groups = [];

        try {
            Object.keys(catGroups).forEach((key) => {
                let options = [];

                catGroups[key].forEach(function(option) {
                    let optionid = option[id];

                    if (skip === optionid) {
                        return;
                    }

                    let name = form.optionName(option, template);

                    options.push(
                        <option key={ `option-${name}` } selected={ selected(option[id]) } value={ optionid }>{ name }</option>
                    );
                })

                groups.unshift(
                    <optgroup key={ `group-${key}` } label={ key }>
                        { options }
                    </optgroup>
                );
            });
        } catch(err) {
            console.log(err);
        }

        return groups;
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
