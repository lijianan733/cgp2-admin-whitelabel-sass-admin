/**
 * Created by nan on 2021/6/4
 * 导航配置有4种类型，序号+文字，图+文字，分页，通用
 * 其中序号+文字
 * container固定为list
 * showWizard 固定为true
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config'
])
Ext.define("CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.CommonNavBarField", {
    extend: "Ext.ux.form.field.UxFieldContainer",
    alias: 'widget.commonnavbarfield',
    defaults: {
        width: '100%',
        flex: 1,
        margin: '5 0 5 0',
        labelWidth: 150,
        disabled: true,
        hidden: true,
        allowBlank: true,
    },
    diySetValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (data && !Ext.isEmpty(data[item.getName()])) {
                if (item.diySetValue) {
                    item.diySetValue(data[item.getName()]);
                } else {
                    item.setValue(data[item.getName()]);
                }
            }
        }
    },
    /**
     * 特殊处理
     */
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        if (data.componentType == '1') {//序号+文字
            data.previousTemplate = '<navigation-wizard-previous>${previousTemplate}</navigation-wizard-previous>';
            data.nextTemplate = '<navigation-wizard-next>${nextTemplate}</navigation-wizard-next>';
        } else if (data.componentType == '3') {//分页
            if (data.showFirstAndLast == true) {
                data.firstTemplate = '<navigation-pager-first>${firstTemplate}</navigation-pager-first>';
                data.lastTemplate = '<navigation-pager-last>${lastTemplate}</navigation-pager-last>';
            }
            if (data.alwaysShowPager == true) {
                data.previousTemplate = '<navigation-pager-previous>${previousTemplate}</navigation-pager-previous>';
                data.nextTemplate = '<navigation-pager-next>${nextTemplate}</navigation-pager-next>';
            }
        }
        return data;
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'combo',
                editable: false,
                name: 'componentType',
                itemId: 'componentType',
                valueField: 'value',
                hidden: false,
                disabled: false,
                displayField: 'display',
                fieldLabel: i18n.getKey('navigation') + i18n.getKey('type'),
                value: '1',
                mapping: {
                    common: ['componentType',],
                    '1': ['container', 'itemTemplate', 'showWizard'],
                    '2': ['container'],
                    '3': ['container', 'alwaysShowPager', 'pageSize', 'showFirstAndLast', 'model'],
                    '4': ['componentType', 'itemTemplate', 'showWizard', 'container', 'alwaysShowPager',
                        'pageSize', 'showFirstAndLast', 'firstTemplate',
                        'nextTemplate', 'previousTemplate', 'lastTemplate']
                },
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: '1',
                            display: i18n.getKey('序号+文字')
                        }, {
                            value: '2',
                            display: i18n.getKey('图片+文字')
                        }, {
                            value: '3',
                            display: i18n.getKey('分页')
                        }, {
                            value: '4',
                            display: i18n.getKey('通用')
                        }
                    ]
                }),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var container = combo.ownerCt;
                        var containerField = container.getComponent('container');
                        var showWizard = container.getComponent('showWizard');
                        if (newValue) {
                            for (var i = 0; i < container.items.items.length; i++) {
                                var item = container.items.items[i];
                                if (Ext.Array.contains(combo.mapping['common'], item.getItemId())) {

                                } else {
                                    if (Ext.Array.contains(combo.mapping[newValue], item.getItemId())) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                            if (newValue == '1') {//序号+文字
                                containerField.setReadOnly(true);
                                showWizard.setReadOnly(true);
                                showWizard.setValue(true);
                                containerField.setValue('list');
                            } else if (newValue == '2') {//图+文字
                                containerField.setReadOnly(true);
                                containerField.setValue('list');
                            } else {
                                containerField.setReadOnly(false);
                                showWizard.setReadOnly(false);
                            }
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                editable: false,
                name: 'model',
                itemId: 'model',
                valueField: 'value',
                displayField: 'display',
                value: 'simple',
                fieldLabel: i18n.getKey('配置模式'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [{
                        value: 'complex',
                        display: i18n.getKey('复杂')
                    }, {
                        value: 'simple',
                        display: i18n.getKey('简单')
                    }]
                }),
                mapping: {
                    common: ['componentType',],
                    'simple': ['container', 'alwaysShowPager', 'pageSize', 'model', 'showFirstAndLast'],
                    'complex': ['componentType', 'itemTemplate', 'container', 'alwaysShowPager', 'model',
                        'pageSize', 'showFirstAndLast', 'firstTemplate',
                        'nextTemplate', 'previousTemplate', 'lastTemplate']
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var container = combo.ownerCt;
                        if (newValue) {
                            for (var i = 0; i < container.items.items.length; i++) {
                                var item = container.items.items[i];
                                if (Ext.Array.contains(combo.mapping['common'], item.getItemId())) {

                                } else {
                                    //新加了type字段和原先的用于标识的字段重复，导致找不到对应的数据
                                    if (Ext.Array.contains(combo.mapping[newValue] || [], item.getItemId())) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                        }
                    }
                }

            },
            {
                xtype: 'checkbox',
                name: 'showWizard',
                itemId: 'showWizard',
                checked: true,
                hidden: false,
                disabled: false,
                fieldLabel: i18n.getKey('启用导航按钮'),
            },
            {
                name: 'itemTemplate',
                xtype: 'textarea',
                hidden: false,
                disabled: false,
                minHeight: 150,
                maxHeight: 250,
                grow: true,
                fieldLabel: i18n.getKey('导航项模板'),
                itemId: 'itemTemplate',
                value: CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.commonNavBar.itemTemplate,
            },
            {
                xtype: 'combo',
                name: 'container',
                hidden: false,
                disabled: false,
                itemId: 'container',
                fieldLabel: i18n.getKey('显示方式'),
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'list',
                readOnly: true,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [{
                        value: 'list',
                        display: i18n.getKey('横向格子列表')
                    }, {
                        value: 'select',
                        display: i18n.getKey('下拉列表')
                    }]
                }),
            },
            {
                xtype: 'checkbox',
                name: 'alwaysShowPager',
                itemId: 'alwaysShowPager',
                checked: true,
                fieldLabel: i18n.getKey('一直显示分页按钮'),
            },
            {
                xtype: 'numberfield',
                name: 'pageSize',
                itemId: 'pageSize',
                minValue: 0,
                value: 1,
                allowDecimals: false,
                fieldLabel: i18n.getKey('每页显示导航项数量'),
            },
            {
                xtype: 'checkbox',
                name: 'showFirstAndLast',
                itemId: 'showFirstAndLast',
                checked: true,
                fieldLabel: i18n.getKey('显示’第一页‘和’最后一页‘按钮'),
            },
            {
                xtype: 'textarea',
                name: 'firstTemplate',
                itemId: 'firstTemplate',
                maxHeight: 120,
                grow: true,
                fieldLabel: i18n.getKey('‘第一页’按钮模板'),
            },
            {
                xtype: 'textarea',
                name: 'previousTemplate',
                itemId: 'previousTemplate',
                maxHeight: 120,
                grow: true,
                fieldLabel: i18n.getKey('‘上一页’按钮模板'),
            },
            {
                xtype: 'textarea',
                name: 'nextTemplate',
                itemId: 'nextTemplate',
                grow: true,
                maxHeight: 120,
                fieldLabel: i18n.getKey('‘下一页’按钮模板'),
            },
            {
                xtype: 'textarea',
                name: 'lastTemplate',
                itemId: 'lastTemplate',
                maxHeight: 120,
                grow: true,
                fieldLabel: i18n.getKey('‘最后一页’按钮模板'),
            }
        ];
        me.callParent();
    },
})