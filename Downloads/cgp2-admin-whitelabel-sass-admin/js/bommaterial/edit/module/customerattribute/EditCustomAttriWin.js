Ext.define("CGP.bommaterial.edit.module.customerattribute.EditCustomAttriWin", {
    extend: 'Ext.window.Window',
    width: 650,
    height: 450,
    autoScroll: true,
    modal: true,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('customAttribute');
        me.items = [
            {
                xtype: 'form',
                border: false,
                itemId: 'customAttrForm',
                padding: '10px',
                fieldDefaults: {
                    width: 350
                },
                items: [
                    {
                        name: 'name',
                        xtype: 'textfield',
                        allowBlank: false,
                        errorsText: 'name.default can not be null',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name'
                    },
                    {
                        name: 'sortOrder',
                        xtype: 'numberfield',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('sortOrder'),
                        autoStripChars: true,
                        itemId: 'sortOrder'
                    },
                    {
                        name: 'validationExp',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('validationExp'),
                        itemId: 'validationExp'
                    },
                    {
                        name: 'required',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('required'),
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {name: 'name'},
                                {name: 'value', type: 'boolean'}
                            ],
                            data: [
                                {name: '是', value: true},
                                {name: '否', value: false}
                            ]
                        }),
                        editable: false,
                        itemId: 'required',
                        allowBlank: false,
                        displayField: 'name',
                        valueField: 'value'
                    },{
                        name: 'readonly',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('readOnly'),
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {name: 'name'},
                                {name: 'value', type: 'boolean'}
                            ],
                            data: [
                                {name: '是', value: true},
                                {name: '否', value: false}
                            ]
                        }),
                        editable: false,
                        itemId: 'readonly',
                        allowBlank: false,
                        displayField: 'name',
                        valueField: 'value'
                    },
                    {
                        name: 'description',
                        xtype: 'textfield',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('description'),
                        itemId: 'description'
                    },
                    {
                        name: 'valueType',
                        xtype: 'combo',
                        id: 'valueType',
                        store: Ext.create("CGP.bommaterial.store.ValueTypeStore"),
                        allowBlank: false,
                        fieldLabel: i18n.getKey('valueType'),
                        editable: false,
                        itemId: 'valueType',
                        valueField: 'code',
                        displayField: 'code',
                        listeners: {
                            change: function(combo,newValue,oldValue){
                                var valueType = combo.getValue();
                                var form = combo.ownerCt;
                                var options = form.getComponent('options');
                                var valueDefault = combo.ownerCt.getComponent('valueDefault');
                                var selectType = form.getComponent('selectType').getValue();
                                if(Ext.isEmpty(me.record)){
                                    if(!Ext.isEmpty(valueDefault)){
                                        form.remove(valueDefault);
                                    };
                                    if(selectType == 'NON'){
                                        if(valueType == 'Boolean'){
                                            form.insert(8,valueDefaultBoolean);
                                        }else if(valueType == 'int' || valueType == 'Number'){
                                            form.insert(8,valueDefaultInt);
                                        }else{
                                            form.insert(8,valueDefaultString);
                                        }
                                    }else if(selectType == 'SINGLE'){
                                        valueDefaultCombo.multiSelect = false;
                                        form.insert(8,valueDefaultCombo);
                                    }else if(selectType == 'MULTI'){
                                        valueDefaultCombo.multiSelect = true;
                                        form.insert(8,valueDefaultCombo);
                                    }

                                }else if(!Ext.isEmpty(valueDefault) && !Ext.isEmpty(me.record)){
                                    form.remove(valueDefault);
                                    var valueDefaultStore = Ext.create('Ext.data.Store',{
                                        fields: ['name','value'],
                                        data: me.record.get('options')
                                    });
                                    if(selectType == 'NON'){
                                        if(valueType == 'Boolean'){
                                            delete valueDefaultBoolean.value;
                                            form.insert(8,valueDefaultBoolean);
                                        }else if(valueType == 'int' || valueType == 'Number'){
                                            delete valueDefaultInt.value;
                                            form.insert(8,valueDefaultInt);
                                        }else{
                                            delete valueDefaultString.value;
                                            form.insert(8,valueDefaultString);
                                        }
                                    }else if(selectType == 'SINGLE'){
                                        valueDefaultCombo.store = valueDefaultStore;
                                        valueDefaultCombo.value = me.record.data.valueDefault;
                                        valueDefaultCombo.multiSelect = false;
                                        form.insert(8,valueDefaultCombo);
                                    }else if(selectType == 'MULTI'){
                                        valueDefaultCombo.store = valueDefaultStore;
                                        valueDefaultCombo.value = me.record.data.valueDefault.split(',');
                                        valueDefaultCombo.multiSelect = true;
                                        form.insert(8,valueDefaultCombo);
                                    }

                                }
                                var stringArr = ['String','Color','CustomType','Boolean'];
                                if(!Ext.isEmpty(options)){
                                    var optionStore = options.getGrid().getStore();
                                    if(Ext.Array.contains(stringArr,newValue)){
                                        if(newValue == 'Boolean'){
                                            optionStore.each(function(record){
                                                if(!Ext.Array.contains(['true','false'],record.get('value'))){
                                                    Ext.Msg.alert('提示','选项值类型与所选值类型不匹配，请删除或修改选项！');
                                                    combo.setValue(oldValue);
                                                    return false;
                                                };
                                            })
                                        }
                                    }else{
                                        optionStore.each(function(record){
                                            if(!Ext.isNumeric(record.get('value'))){
                                                Ext.Msg.alert('提示','选项值类型与所选值类型不匹配，请删除或修改选项！');
                                                combo.setValue(oldValue);
                                                return false;
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    },
                    {
                        editable: false,
                        allowBlank: false,
                        name: 'selectType',
                        id: 'selectType',
                        xtype: 'combo',
                        store: Ext.create("CGP.bommaterial.store.SelectTypeStore"),
                        fieldLabel: i18n.getKey('selectInputType'),
                        displayField: 'code',
                        valueField: 'code',
                        itemId: 'selectType',
                        value: '---' + i18n.getKey('selectInputType ') + '---',
                        listeners: {
                            "change": function (combo, newValue, oldValue) {
                                var form = combo.ownerCt;
                                var options = form.getComponent('options');
                                var notOptional = ['NON'];
                                var valueType = form.getComponent('valueType').getValue();
                                var valueDefault = form.getComponent('valueDefault');
                                if (Ext.Array.contains(notOptional, combo.getValue())) {
                                    if (!Ext.isEmpty(options) && options.isVisible()) {
                                        options.setDisabled(true);
                                        options.setVisible(false);
                                    }
                                } else {
                                    if (Ext.isEmpty(options) && Ext.isEmpty(me.record)) {
                                        var options = Ext.create("CGP.bommaterial.edit.module.customerattribute.OptionGrid", {
                                            name: 'options',
                                            fieldLabel: i18n.getKey('options'),
                                            itemId: 'options'
                                        });
                                        form.add(options);

                                    } else if (!Ext.isEmpty(options)) {
                                        options.setDisabled(false);
                                        options.setVisible(true);
                                    }
                                }
                                if(!Ext.isEmpty(me.record)){
                                    var valueDefaultStore = Ext.create('Ext.data.Store',{
                                        fields: ['name','value'],
                                        data: me.record.get('options')
                                    })
                                };
                                if(!Ext.isEmpty(valueDefault)){
                                    form.remove(valueDefault);
                                };
                                if(!Ext.isEmpty(valueType)){
                                    if(!Ext.isEmpty(me.record)){
                                        if(combo.getValue() == 'SINGLE'){
                                            if(options){
                                                if(!Ext.isEmpty(options.getSubmitValue())){valueDefaultCombo.store = Ext.create('Ext.data.Store',{
                                                    fields: ['name','value'],
                                                    data: options.getSubmitValue()
                                                });}
                                            }else{
                                                valueDefaultCombo.store = valueDefaultStore;
                                            }
                                            valueDefaultCombo.value = me.record.data.valueDefault;
                                        }else if(combo.getValue() == 'MULTI'){
                                            if(options){
                                                if(!Ext.isEmpty(options.getSubmitValue())){valueDefaultCombo.store = Ext.create('Ext.data.Store',{
                                                    fields: ['name','value'],
                                                    data: options.getSubmitValue()
                                                });}
                                            }else{
                                                valueDefaultCombo.store = valueDefaultStore;
                                            }
                                            //valueDefaultCombo.store = valueDefaultStore;
                                            valueDefaultCombo.value = me.record.data.valueDefault.split(',');
                                            valueDefaultCombo.multiSelect = true;
                                        }
                                    }
                                    if(combo.getValue() == 'SINGLE'){
                                        valueDefaultCombo.multiSelect = false;
                                        form.insert(8,valueDefaultCombo);
                                    }else if(combo.getValue() == 'MULTI'){
                                        valueDefaultCombo.multiSelect = true;
                                        form.insert(8,valueDefaultCombo);
                                    }else if(combo.getValue() == 'NON'){
                                        if(valueType == 'Boolean'){
                                            delete valueDefaultBoolean.value;
                                            form.insert(8,valueDefaultBoolean);
                                        }else if(valueType == 'int' || valueType == 'Number'){
                                            delete valueDefaultInt.value;
                                            form.insert(8,valueDefaultInt);
                                        }else{
                                            delete valueDefaultString.value;
                                            form.insert(8,valueDefaultString);
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        ];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('save'),
            handler: function () {
                if(me.form.isValid()){
                    var data = me.form.getValues();
                    var valueDefault = me.form.getComponent('valueDefault').getValue();
                    if (Ext.isEmpty(me.record)) {
                        if(data.selectType == 'NON'){
                            data.options = [];
                        };
                        data.valueDefault = valueDefault;
                        me.store.add(data);
                    } else {
                        Ext.Object.each(data, function (key, value) {
                            if(key == 'valueDefault'){
                                me.record.set(key,valueDefault)
                            }else{
                                me.record.set(key, value);
                            }
                        })
                    }
                    me.close();
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];
        var valueDefaultString = {
            name: 'valueDefault',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('valueDefault'),
            itemId: 'valueDefault'
        };
        var valueDefaultCombo = {
            name: 'valueDefault',
            xtype: 'combo',
            fieldLabel: i18n.getKey('valueDefault'),
            itemId: 'valueDefault',
            valueField: 'value',
            editable: false,
            id: 'valueDefaultCombo',
            queryMode: 'local',
            displayField: 'name',
            store: Ext.create('Ext.data.Store',{
                fields: ['name','value'],
                data: []
            })
        };
        var valueDefaultInt = {
            name: 'valueDefault',
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('valueDefault'),
            itemId: 'valueDefault'
        };
        var valueDefaultBoolean ={
            name: 'valueDefault',
            xtype: 'combo',
            fieldLabel: i18n.getKey('valueDefault'),
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'name'},
                    {name: 'value', type: 'string'}
                ],
                data: [
                    {name: '是', value: 'True'},
                    {name: '否', value: 'False'}
                ]
            }),
            editable: false,
            itemId: 'valueDefault',
            displayField: 'name',
            valueField: 'value'
        };

        me.listeners = {
            'beforerender': function (window) {
                if (!Ext.isEmpty(me.record)) {
                    var options = Ext.create("CGP.bommaterial.edit.module.customerattribute.OptionGrid", {
                        data: me.record.data.options,
                        listeners:{
                            afterrender: function(comp){
                                var selectType = me.record.get('selectType');
                                if(selectType == 'NON'){
                                    comp.setDisabled(true);
                                }
                            }
                        },
                        name: 'options',
                        fieldLabel: i18n.getKey('options'),
                        itemId: 'options'
                    });
                    var form = window.down('form');
                    form.add(options);

                    var valueDefaultStore = Ext.create('Ext.data.Store',{
                        fields: ['name','value'],
                        data: me.record.get('options')
                    })

                    if(me.record.get('selectType') == 'NON'){
                        if(me.record.data.valueType == 'Boolean'){
                            valueDefaultBoolean.value = me.record.data.valueDefault;
                            form.insert(8,valueDefaultBoolean);
                        }else if(me.record.data.valueType == 'int' || me.record.data.valueType == 'Number'){
                            valueDefaultInt.value = me.record.data.valueDefault;
                            form.insert(8,valueDefaultInt);
                        }else{
                            valueDefaultString.value = me.record.data.valueDefault;
                            valueDefaultString.valueType = me.record.data.valueType;
                            form.insert(8,valueDefaultString);
                        }
                    }else if(me.record.get('selectType') == 'SINGLE'){
                        valueDefaultCombo.store = valueDefaultStore;
                        valueDefaultCombo.value = me.record.data.valueDefault;
                        form.insert(8,valueDefaultCombo);

                    }else if(me.record.get('selectType') == 'MULTI'){
                        valueDefaultCombo.store = valueDefaultStore;
                        valueDefaultCombo.value = me.record.data.valueDefault.split(',');
                        valueDefaultCombo.multiSelect = true;
                        form.insert(8,valueDefaultCombo);
                    }

                }
            }
        }
        me.callParent(arguments);
        me.form = me.down("form");
        if (!Ext.isEmpty(me.record)) {
            me.form.loadRecord(me.record);
        };

    }
})