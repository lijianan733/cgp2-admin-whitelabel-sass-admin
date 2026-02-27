Ext.define("CGP.bommaterial.edit.module.customerattribute.EditCustomerAttriWin", {
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
                        name: 'valueType',
                        xtype: 'combo',
                        store: Ext.create("CGP.bommaterial.store.ValueTypeStore"),
                        allowBlank: false,
                        fieldLabel: i18n.getKey('valueType'),
                        editable: false,
                        itemId: 'valueType',
                        valueField: 'code',
                        displayField: 'code',
                        listeners: {
                            change: function(combo){
                                var valueType = combo.getValue();
                                var form = combo.ownerCt;
                                var valueDefault = combo.ownerCt.getComponent('valueDefault');
                                if(Ext.isEmpty(valueDefault) && Ext.isEmpty(me.record)){
                                    if(valueType == 'Boolean'){
                                        form.insert(6,valueDefaultBoolean);
                                    }else if(valueType == 'int' || valueType == 'Number'){
                                        form.insert(6,valueDefaultInt);
                                    }else{
                                        form.insert(6,valueDefaultString);
                                    }
                                }else if(!Ext.isEmpty(valueDefault) && !Ext.isEmpty(me.record)){
                                    form.remove(valueDefault);
                                    if(valueType == 'Boolean'){
                                            delete valueDefaultBoolean.value;
                                        form.insert(6,valueDefaultBoolean);
                                    }else if(valueType == 'int' || valueType == 'Number'){
                                            delete valueDefaultInt.value;
                                        form.insert(6,valueDefaultInt);
                                    }else{
                                            delete valueDefaultString.value;
                                        form.insert(6,valueDefaultString);
                                    }
                                }else if(!Ext.isEmpty(valueDefault) && Ext.isEmpty(me.record)){
                                    form.remove(valueDefault);
                                    if(valueType == 'Boolean'){
                                        form.insert(6,valueDefaultBoolean);
                                    }else if(valueType == 'int' || valueType == 'Number'){
                                        form.insert(6,valueDefaultInt);
                                    }else{
                                        form.insert(6,valueDefaultString);
                                    }
                                }
                            }
                        }
                    },
                    /*{
                        name: 'valueDefault',
                        xtype: 'textfield',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('valueDefault'),
                        itemId: 'valueDefault'
                    },*/
                    {
                        name: 'description',
                        xtype: 'textfield',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('description'),
                        itemId: 'description'
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
                        itemId: 'SelectType',
                        value: '---' + i18n.getKey('selectInputType ') + '---',
                        listeners: {
                            "change": function (combo, newValue, oldValue) {
                                var window = combo.ownerCt.ownerCt;
                                var options = combo.ownerCt.getComponent('options');
                                var notOptional = ['NON']
                                if (Ext.Array.contains(notOptional, combo.getValue())) {
                                    if (!Ext.isEmpty(options) && options.isVisible()) {
                                        options.setDisabled(true);
                                        options.setVisible(false);
                                        //options.getGrid().setVisible(false);
                                    }
                                } else {
                                    if (Ext.isEmpty(options) && Ext.isEmpty(me.record)) {
                                        var options = Ext.create("CGP.bommaterial.edit.module.customerattribute.OptionGrid", {
                                            name: 'options',
                                            fieldLabel: i18n.getKey('options'),
                                            itemId: 'options'
                                        });
                                        window.down('form').add(options);

                                    } else if (!Ext.isEmpty(options)) {
                                        options.setDisabled(false);
                                        options.setVisible(true);
                                        //options.getGrid().setVisible(true);
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
                    if (Ext.isEmpty(me.record)) {
                        if(data.selectType == 'NON'){
                            data.options = [];
                        }
                        me.store.add(data);
                    } else {
                        Ext.Object.each(data, function (key, value) {
                            me.record.set(key, value);
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
        var valueDefaultInt = {
            name: 'valueDefault',
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('valueDefault'),
            itemId: 'valueDefault'
        };
        var valueDefaultBoolean ={
            name: 'valueDefault',
            xtype: 'combo',
            multiSelect: true,
            fieldLabel: i18n.getKey('valueDefault'),
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'name',type: 'string'},
                    {name: 'value', type: 'string'}
                ],
                data: [
                    {name: '是', value: 'true'},
                    {name: '否', value: 'false'}
                ]
            }),
            editable: false,
            itemId: 'valueDefault',
            displayField: 'name',
            valueField: 'value'
        };
        me.listeners = {
            'render': function (window) {
                if (!Ext.isEmpty(me.record)) {
                    var options = Ext.create("CGP.bommaterial.edit.module.customerattribute.OptionGrid", {
                        data: me.record.data.options,
                        listeners:{
                            afterrender: function(comp){
                                var selectType = me.record.get('selectType');
                                var valueType = me.record.get('valueType');
                                if(selectType == 'NON'){
                                    comp.setDisabled(true);
                                    /*comp.setVisible(false);
                                    comp.getGrid().setVisible(false);*/
                                }
                            }
                        },
                        name: 'options',
                        fieldLabel: i18n.getKey('options'),
                        itemId: 'options'
                    });
                    window.down('form').add(options);
                    if(me.record.data.valueType == 'Boolean'){
                        valueDefaultBoolean.value = me.record.data.valueDefault;
                        window.down('form').insert(6,valueDefaultBoolean);
                    }else if(me.record.data.valueType == 'int' || me.record.data.valueType == 'Number'){
                        valueDefaultInt.value = me.record.data.valueDefault;
                        window.down('form').insert(6,valueDefaultInt);
                    }else{
                        valueDefaultString.value = me.record.data.valueDefault;
                        valueDefaultString.valueType = me.record.data.valueType;
                        window.down('form').insert(6,valueDefaultString);
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