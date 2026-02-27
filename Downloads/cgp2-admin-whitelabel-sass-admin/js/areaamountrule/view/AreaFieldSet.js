/**
 * @Description:
 * @author nan
 * @date 2023/9/13
 */
Ext.Loader.syncRequire([
    'CGP.zone.store.countrystore',
    'CGP.zone.store.Zone'
])
Ext.define('CGP.areaamountrule.view.AreaFieldSet', {
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
                itemId: 'country',
                editable: false,
                fieldLabel: i18n.getKey('country'),
                allowBlank: false,
                name: 'country',
                displayField: 'name',
                valueField: 'id',
                store: me.countryStore,
                queryMode: 'remote',
                matchFieldWidth: false,
                gridCfg: {
                    height: 300,
                    width: 400,
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
                listeners: {
                    change: function (gridCombo, newValue, oldValue) {
                        var stateField = gridCombo.ownerCt.getComponent('state');
                        var countryId = gridCombo.getSubmitValue()[0];
                        stateField.store.proxy.extraParams = {
                            filter: Ext.JSON.encode([{
                                name: 'country.id',
                                type: 'number',
                                value: countryId ? countryId : 0
                            }])
                        }
                        stateField.store.load();
                        //清空state中的值
                        stateField.setValue();
                        stateField.setRawValue()

                    }
                }
            },
            {
                name: 'state',
                fieldLabel: i18n.getKey('state'),
                itemId: 'state',
                xtype: 'gridcombo',
                haveReset: true,
                displayField: 'code',
                valueField: 'id',
                editable: false,
                allowBlank: true,
                store: me.zoneStore,
                multiSelect: false,
                matchFieldWidth: false,
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data.id])
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
                            dataIndex: 'id'
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
