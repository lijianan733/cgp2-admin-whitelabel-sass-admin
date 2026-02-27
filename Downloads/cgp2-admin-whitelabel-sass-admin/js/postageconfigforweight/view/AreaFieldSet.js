/**
 * @Description: 使用Code来记录数据，不再使用id
 * @author nan
 * @date 2023/9/13
 */
Ext.Loader.syncRequire([
    'CGP.zone.store.countrystore',
    'CGP.zone.store.Zone'
])
Ext.define('CGP.postageconfigforweight.view.AreaFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.area_fieldset',
    title: i18n.getKey('area'),
    defaults: {
        width: '100%',
        margin: '5 25 5 25',
    },
    countryStore: null,
    zoneStore: null,
    initComponent: function () {
        var me = this;
        me.countryStore = Ext.create('CGP.zone.store.countrystore');
        me.zoneStore = Ext.create('CGP.zone.store.Zone', {
            autoLoad: false,
        });
        me.items = [
            {
                xtype: 'gridcombo',
                itemId: 'countryCode',
                editable: false,
                fieldLabel: i18n.getKey('country'),
                allowBlank: false,
                name: 'countryCode',
                displayField: 'isoCode2',
                valueField: 'isoCode2',
                store: me.countryStore,
                queryMode: 'remote',
                matchFieldWidth: false,
                valueType: 'id',//recordData,idReference,id为可选的值类型
                gridCfg: {
                    height: 300,
                    width: 600,
                    columns: [
                        {
                            text: 'id',
                            width: 40,
                            dataIndex: 'id'
                        }, {
                            text: 'name',
                            width: 120,
                            dataIndex: 'name'
                        }, {
                            text: 'isoCode2',
                            flex: 1,
                            dataIndex: 'isoCode2'
                        }],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.countryStore,
                    }
                },
                filterCfg: {
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        style: 'margin-right:20px; margin-top : 5px;',
                        labelWidth: 50,
                        width: 250
                    },
                    items: [
                        {
                            name: 'id',
                            xtype: 'numberfield',
                            allowDecimals: false,
                            hideTrigger: true,
                            fieldLabel: i18n.getKey('id'),
                            itemId: 'id'
                        },
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        },
                        {
                            name: 'isoCode2',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('isoCode') + "(2)",
                            itemId: 'isoCode2',
                            diyGetValue: function () {
                                var me = this;
                                return me.getValue()?.toUpperCase();
                            }
                        }]
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setValue({
                        isoCode2: data
                    });
                },
                listeners: {
                    change: function (gridCombo, newValue, oldValue) {
                        var stateField = gridCombo.ownerCt.getComponent('stateCode');
                        if (!Ext.Object.isEmpty(newValue)) {
                            var countryCode = gridCombo.getSubmitValue()[0];
                            stateField.store.proxy.extraParams = {
                                filter: Ext.JSON.encode([{
                                    name: 'country.isoCode2',
                                    type: 'string',
                                    value: countryCode ? countryCode : 0
                                }])
                            }
                            stateField.store.load();
                            //清空state中的值
                            stateField.setValue();
                            stateField.setRawValue();
                        }
                    }
                }
            },
            {
                name: 'stateCode',
                fieldLabel: i18n.getKey('state'),
                itemId: 'stateCode',
                xtype: 'gridcombo',
                haveReset: true,
                displayField: 'code',
                valueField: 'code',
                editable: false,
                allowBlank: true,
                store: me.zoneStore,
                multiSelect: false,
                matchFieldWidth: false,
                valueType: 'id',//recordData,idReference,id为可选的值类型
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue({
                            code: data
                        });
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getArrayValue();
                },
                gridCfg: {
                    height: 300,
                    width: 500,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: 'id',
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 100,
                            dataIndex: 'name'
                        },
                        {
                            text: i18n.getKey('code'),
                            width: 100,
                            dataIndex: 'code'
                        },
                        {
                            text: i18n.getKey('country'),
                            flex: 1,
                            dataIndex: 'country',
                            renderer: function (v) {
                                return v.name;
                            }
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.zoneStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                    }
                }
            },
            {
                xtype: 'textfield',
                allowBlank: true,
                fieldLabel: i18n.getKey('city'),
                name: 'city',
                itemId: 'city'
            }
        ];
        me.callParent()
    },
})
