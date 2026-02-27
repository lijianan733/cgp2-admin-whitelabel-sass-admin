/**
 * @author xiu
 * @date 2022/9/19
 */
Ext.syncRequire([
    'CGP.costenterconfig.store.processCostConfigStore',
    'CGP.processinstancejobcharacter.store.AbstractUProcessInstanceJobCharacterStore',
    'CGP.costenterconfig.component.edit.accountingConfig',
    'CGP.costenterconfig.component.edit.effectiveDuration',
    'CGP.costenterconfig.component.edit.processCharacters'
])
Ext.onReady(function () {
    var character = JSGetQueryString('character');

    Ext.widget({
        xtype: 'uxeditpage',
        block: 'costenterconfig',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.costenterconfig.model.processCostConfigModel',
            remoteCfg: false,
            useForEach: true,
            layout: {
                layout: 'table',
                columns: 1,
                tdAttrs: {
                    style: {
                        'padding-right': '120px'
                    }
                }
            },
            defaults: {
                padding: '0 0 20 0',
            },
            items: [
                {
                    name: '_id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    hidden: true
                },
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz',
                    hidden: true,
                    width: 280,
                    value: 'com.qpp.mccs.domain.cost.ProcessCostConfig'
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('name'),
                    padding: '0 0 20 0',
                    itemId: 'name',
                    name: 'name',
                    displayField: 'value',
                    valueField: 'key',
                    editable: false,
                    readOnly: true,
                    allowBlank: false,
                    value: character,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'key'],
                        data: [
                            {
                                value: i18n.getKey('laborCost'),
                                key: 'laborCost'
                            },
                            {
                                value: i18n.getKey('overhead'),
                                key: 'overhead'
                            },
                            {
                                value: i18n.getKey('dpctOfMcn'),
                                key: 'dpctOfMcn'
                            }
                        ]
                    }),
                },
                {
                    xtype: 'effectiveduration',
                    name: 'effectiveDuration',
                    itemId: 'effectiveDuration',
                    fieldLabel: i18n.getKey('effectiveTime'),
                    allowBlank: false,
                    getName: function () {
                        return this.name;
                    },
                    diySetValue(data) {
                        var me = this;
                        var items = me.items.items;
                        items.forEach(item => {
                            var date = new Date(data[item.getName()]);
                            item.setValue(date);
                        })
                    },
                },
                {
                    xtype: 'processcharacters',
                    margin: '20 60',
                    padding: 20,
                    width: '100%',
                    allowScroll: false,
                    itemId: 'processCharacters',
                    name: 'processCharacters',
                    title: i18n.getKey('processCharacter') + i18n.getKey('matching'),
                    getName: function () {
                        return this.name
                    },
                    diyGetValue: function () {
                        var me = this;
                        var items = me.items.items;
                        var result = [];
                        items.forEach(item => {
                            if (item.getValue()) {
                                var clazz;
                                if (!item.isDisabled()) {
                                    if (item.getName() === 'manufactureCenterCharactor') {
                                        clazz = 'com.qpp.mccs.domain.charactor.UProcessInstanceJobManufactureCenterCharacter';
                                    } else {
                                        clazz = 'com.qpp.mccs.domain.charactor.UProcessInstanceJobWorkingUnitCharacter';
                                    }
                                    var data = {
                                        clazz: clazz,
                                        multilingualKey: clazz
                                    };
                                    data['_id'] = item.getValue();
                                    result.push(data);
                                }
                            }
                        })
                        if (result.length !== undefined) {
                            return result;
                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        var manufactureCenterCharactor = me.getComponent('manufactureCenterCharactor');
                        var workingUnitCharacter = me.getComponent('workingUnitCharacter');
                        data.forEach(item => {
                            var itemId = item._id;
                            if (item.clazz === 'com.qpp.mccs.domain.charactor.UProcessInstanceJobWorkingUnitCharacter') {
                                workingUnitCharacter.diySetValue([itemId]);
                            } else {
                                manufactureCenterCharactor.diySetValue([itemId]);
                            }
                        })
                    },
                },
                {
                    xtype: 'accountingconfig',
                    title: i18n.getKey('accountingConfig'),
                    itemId: 'value',
                    name: 'value',
                    margin: '20 60',
                    padding: 20,
                    width: '100%',
                    diyGetValue: function () {
                        var me = this;
                        var items = me.items.items;
                        var result = {
                            clazz: 'com.qpp.mccs.domain.cost.TimeBaseCostValueConfig',
                            multilingualKey: 'com.qpp.mccs.domain.cost.TimeBaseCostValueConfig'
                        };
                        items.forEach(item => {
                            if (!item.isDisabled()) {
                                result[item.getName()] = item.getValue();
                            }
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this;
                        var items = me.items.items;
                        items.forEach(item => {
                            item.setValue(data[item.getName()])
                        })
                    },
                }
            ]
        }
    })
})
