/**
 * Created by admin on 2021/1/14.
 */
Ext.define("CGP.tools.freemark.Main", {
    extend: "Ext.tab.Panel",
    region: 'center',
    header: false,
    id: 'freemarkTools',
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');

        me.itemId = 'freemark';
        me.title = i18n.getKey("freemark");
        var defaultVariateStore = Ext.create('CGP.tools.freemark.template.store.VariableKey', {
            storeId: 'defaultVariateStore',
            data: [
                {
                    name: 'printQty',
                    valueType: 'number',
                    description: '打印数量'
                },
                {
                    name: 'pageIndex',
                    valueType: 'number',
                    description: '当前页'
                },
                {
                    name: 'pageTotal',
                    valueType: 'number',
                    description: '总页数'
                },
                {
                    name: 'barCode',
                    valueType: 'string',
                    description: '条码'
                }
            ]
        });
        var InforForm = Ext.create('Ext.form.Panel', {
            itemId: 'InforForm',
            title: i18n.getKey("freemark"),
            bodyStyle: 'padding:10px',
            autoScroll: true,
            allowBlank: false,
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 120,
                msgTarget: 'side',
                validateOnChange: false,
                plugins: [
                    {
                        ptype: 'uxvalidation'
                    }
                ]
            },
            tbar: Ext.create('Ext.toolbar.Toolbar', {
                items: [
                    {
                        itemId: 'btnExecute',
                        text: i18n.getKey('execute'),
                        //iconCls: 'icon_save',
                        handler: function (comp) {
                            if (!InforForm.isValid()) {
                                return false;
                            }
                            var data = InforForm.getValue();
                            var mask = me.ownerCt.setLoading();
                            controller.testFreemark(data, mask);
                        }
                    }
                ]
            }),
            items: [
                {
                    xtype: 'fieldcontainer',
                    name: 'variableTemplate',
                    fieldLabel: i18n.getKey('freemarkTemplate'),
                    layout: 'vbox',
                    allowBlank: false,
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'variableInput',
                            text: i18n.getKey('variable') + i18n.getKey('input'),
                            handler: function (btn) {
                                var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
                                controller.fromVariable(btn);
                            }
                        },
                        {
                            xtype: 'textareafield',
                            itemId: 'freemarkerExpression',
                            name: 'freemarkerExpression',
                            fieldLabel: i18n.getKey('freemarkerExp'),
                            labelAlign: 'top',
                            rows: 10,
                            width: '100%',
                            allowBlank: false,
                            listeners:{
                                change:function (comp,newValue,oldValue){
                                    if(!Ext.isEmpty(newValue)){
                                        Ext.getCmp('formInput').setDisabled(false);
                                    }
                                    else {
                                        Ext.getCmp('formInput').setDisabled(true);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textareafield',
                            itemId: 'resultTemplate',
                            name: 'variableTemplate',
                            fieldLabel: i18n.getKey('resultTemplate'),
                            labelAlign: 'top',
                            rows: 10,
                            width: '100%',
                            allowBlank: false
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: i18n.getKey('orderData'),
                    name: 'orderData',
                    layout: 'vbox',
                    allowBlank: false,
                    items: [
                        {
                            xtype: 'button',
                            id: 'formInput',
                            itemId: 'formInput',
                            text: i18n.getKey('productAttribute') + i18n.getKey('input'),
                            disabled: true,
                            handler: function (btn) {
                                controller.orderDataForm(btn);
                            }
                        },
                        {
                            xtype: 'textareafield',
                            itemId: 'orderData',
                            name: 'orderData',
                            rows: 15,
                            width: '100%',
                            allowBlank: false
                        }
                    ]
                }
            ],
            isValid: function () {
                var me = this, isValid = true;
                var items = me.items.items;
                Ext.Array.forEach(items, function (item) {
                    if (item.allowBlank === false) {
                        Ext.Array.forEach(item.items.items, function (comp) {
                            if (comp.allowBlank === false && !comp.isValid()) {
                                return false;
                            }
                        })
                    }
                });
                return isValid;
            },
            getValue: function () {
                var me = this;
                var data = {};
                Ext.Array.forEach(me.items.items, function (item) {
                    if (item.name && item.xtype == 'fieldcontainer') {
                        if (item.name == 'orderData')
                            data[item.name] = JSON.parse(item.getComponent(item.name).getValue());
                        else {
                            data['variableTemplate'] = item.getComponent('resultTemplate').getValue();
                            data['freemarkerExpression'] = item.getComponent('freemarkerExpression').getValue();
                        }
                    }
                });
                return data;
            }
        });
        me.items = [
            InforForm,
            {
                xtype: 'panel',
                itemId: 'variablePanel',
                title: i18n.getKey("variableToFreemark"),
                autoScroll: true,
                html: '<iframe id="tools_iframe_variable" src="' + path + 'partials/tools/freemark/template/main.html" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>'
            }
        ];
        me.callParent(arguments);

    },
    addEditTab: function (id, tabTitle) {
        var me = this;
        me.isLock = me.getQueryString('isLock') == 'true' ? true : false;
        var url = path + 'partials/tools/freemark/template/edit.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            url = url + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit') + '(' + id + ')';
        }

        var tab = Ext.getCmp('variableEdit');
        if (tab == null) {
            var tab = me.add({
                id: 'variableEdit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

});