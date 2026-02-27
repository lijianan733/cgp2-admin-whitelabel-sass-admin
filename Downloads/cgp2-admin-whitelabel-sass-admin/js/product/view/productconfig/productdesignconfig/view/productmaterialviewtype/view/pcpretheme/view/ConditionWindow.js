/**
 * Created by nan on 2021/10/16
 * 编辑或新建一条条件分支的窗口
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.ConditionWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    maximizable: true,
    layout: 'fit',
    createOrEdit: 'create',
    outGrid: null,
    record: null,
    gridSpecialRecord: null,
    mvtId: null,
    mvtType: null,
    contentData: null,
    width: 1000,
    contentTemplate: null,
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    setValue: function (data) {
        var me = this;
        var form = me.getComponent('form');
        form.items.items.forEach(function (item) {
            if (item.diySetValue) {
                item.diySetValue(data[item.getName()]);
            } else if (item.setValue) {
                item.setValue(data[item.getName()]);
            }
        })

    },
    getValue: function () {

    },
    initComponent: function () {
        var me = this;
        var singleThemeStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.PCPreThemeStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'mvt._id',
                    type: 'string',
                    value: me.mvtId
                }])
            }
        });
        me.gridSpecialRecord = {
            else: null,
            empty: null
        };
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('rule');
        for (var i = 0; i < me.outGrid.store.getCount(); i++) {
            var record = me.outGrid.store.getAt(i);
            var condition = record.get('condition');
            if (condition && condition.conditionType == 'else') {
                me.gridSpecialRecord.else = record;
            } else if (Ext.isEmpty(condition)) {
                me.gridSpecialRecord.empty = record;
            }
        }
        me.items = [
            {
                xtype: 'errorstrickform',
                border: false,
                itemId: 'form',
                isValidForItems: true,//是否校验时用item.forEach来处理
                defaults: {
                    margin: '5 25 5 25',
                    allowBlank: false,
                    width: 320
                },
                items: [
                    {
                        name: 'clazz',
                        itemId: 'clazz',
                        xtype: 'hiddenfield',
                        fieldLabel: i18n.getKey('clazz'),
                        value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
                    },
                    {
                        name: 'description',
                        itemId: 'description',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description')
                    },
                    {
                        xtype: 'gridcombo',
                        itemId: 'outputValue',
                        name: 'outputValue',
                        fieldLabel: i18n.getKey('默认主题'),
                        allowBlank: false,
                        displayField: 'diyDisplay',
                        valueField: '_id',
                        editable: false,
                        store: singleThemeStore,
                        matchFieldWidth: false,
                        gridCfg: {
                            height: 350,
                            width: 400,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('description'),
                                    dataIndex: 'description',
                                    flex: 1,
                                },
                                {
                                    text: i18n.getKey('type'),
                                    dataIndex: 'clazz',
                                    flex: 1,
                                    renderer: function (value, mateData, record) {
                                        return value.split('.').pop();
                                    }
                                }
                            ],
                            bbar: {
                                store: singleThemeStore,
                                xtype: 'pagingtoolbar',
                            }
                        },
                        diyGetValue: function () {
                            var me = this;
                            return {
                                value: me.getSubmitValue()[0],
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue'
                            }
                        },
                        diySetValue: function (data) {
                            if (data) {
                                this.setInitialValue([data['value']]);
                            }
                        },
                    },
                    {
                        xtype: 'conditionfieldcontainer',
                        name: 'condition',
                        itemId: 'condition',
                        labelAlign: 'top',
                        width: '100%',
                        height: '100%',
                        minHeight: 80,
                        margin: '5 25 25 25',
                        allowBlank: true,
                        allowElse: true,
                        fieldLabel: i18n.getKey('condition'),
                    }
                ],
            }
        ];
        me.bbar = {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                xtype: 'button',
                iconCls: 'icon_save',
                text: i18n.getKey('confirm'),
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var form = win.items.items[0];
                    if (form.isValid()) {
                        var data = form.getValue();
                        if (win.createOrEdit == 'create') {
                            if (data.condition && data.condition.conditionType == 'else') {
                                if (me.gridSpecialRecord.else) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                                    return;
                                }
                            } else if (Ext.isEmpty(data.condition)) {
                                if (me.gridSpecialRecord.empty) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                                    return;
                                }
                            }
                            win.outGrid.store.proxy.data.push(data);
                        } else {
                            if (data.condition && data.condition.conditionType == 'else') {
                                if (me.gridSpecialRecord.else && win.record != me.gridSpecialRecord.else) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                                    return;
                                }
                            } else if (Ext.isEmpty(data.condition)) {
                                if (me.gridSpecialRecord.empty && win.record != me.gridSpecialRecord.empty) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                                    return;
                                }
                            }
                            win.outGrid.store.proxy.data[win.record.index] = data;
                        }
                        win.outGrid.store.load();
                        win.outGrid.saveMVT(win.createOrEdit == 'create' ? i18n.getKey('addsuccessful') : i18n.getKey('modifySuccess'));
                        win.close();
                    }
                }
            }
        };
        me.callParent();
    },
    listeners: {
        afterrender: function (win) {
            var me = this;
            if (win.record) {
                win.setValue(win.record.getData());
            }
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                var toolbar = win.getDockedItems('toolbar[dock="bottom"]')[0];
                toolbar.hide();
            }
        }
    }
})