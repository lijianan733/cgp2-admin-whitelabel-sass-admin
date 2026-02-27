/**
 * @author xiu
 * @date 2023/10/16
 * 思路
 * 0.像这样的页面都应该放在errorstrickform中 监听其必填项
 * 默认监听所有field组件 如果需要监听非field组件 需要加isFormField: true标识
 *
 * 1.将页面分为三个部分 模板选择 / 容器 / 查看结果
 *
 * 2.发送templateUrl请求拿到模板集合  放入模板选择组件中 默认选中第一个
 *
 * 3.根据用户选择的模板动态生成 容器内的内容
 *   选中时拿到模板的name 发送templateInfoUrl请求拿到该模板的信息并渲染生成
 *
 * 4.点击生成时 发送createPathUrl请求 拿到结果并显示查看结果
 */
Ext.define('CGP.tools.createPathFile.view.createPath', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.createPath',
    title: i18n.getKey('生成Path'),
    layout: 'fit',
    autoScroll: true,
    initComponent: function () {
        const me = this,
            controller = Ext.create('CGP.tools.createPathFile.controller.Controller'),
            templateUrl = controller.getUrl('templateUrl'),
            // 请求模板 拿到模板name
            template = controller.getQuery(templateUrl);
        me.tbar = [
            {
                xtype: 'button',
                width: 80,
                iconCls: 'icon_create_path',
                text: i18n.getKey('生成'),
                handler: function (btn) {
                    const panel = btn.ownerCt.ownerCt,
                        form = panel.getComponent('form'),
                        result = form.getComponent('result'),
                        container = form.getComponent('container');

                    if (form.isValid()) {
                        const {dpi, exportSetting, parameters, name} = container.diyGetValue(),
                            params = {
                                layer: exportSetting,
                                dpi: dpi,
                                templateName: name
                            },
                            createPathUrl = controller.getUrl('createPathUrl', params);

                        controller.asyncEditQuery(createPathUrl, parameters, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    const data = responseText.data;
                                    result.diySetValue(data)
                                }
                            }
                        })
                    }
                }
            }
        ]
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                layout: 'vbox',
                autoScroll: true,
                items: [
                    {
                        xtype: 'combo',
                        name: 'template',
                        itemId: 'template',
                        editable: false,
                        allowBlank: false,
                        margin: '5 25 5 25',
                        width: 350,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['_id', 'name'],
                            data: template
                        }),
                        valueField: 'name',
                        displayField: 'name',
                        fieldLabel: i18n.getKey('模板选择'),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                const panel = combo.ownerCt,
                                    container = panel.getComponent('container'),
                                    result = panel.getComponent('result'),

                                    // 监听更换模板时 更换请求模板详细信息数据
                                    templateInfoUrl = controller.getUrl('templateInfoUrl', {
                                        templateName: newValue
                                    }),
                                    templateInfo = controller.getQuery(templateInfoUrl);

                                // 渲染数据
                                result.clearInfo();
                                container.clearInfo();
                                container.diySetValue(templateInfo);
                            }
                        }
                    },
                    {
                        xtype: 'container',
                        name: 'container',
                        itemId: 'container',
                        layout: 'vbox',
                        width: '100%',
                        defaults: {
                            margin: '5 25 5 25',
                            width: 350
                        },
                        clearInfo: function () {
                            const me = this,
                                items = me.items.items
                            items.forEach(item => {
                                item.clearInfo && item.clearInfo()
                            })
                        },
                        diySetValue: function (data) {
                            const me = this,
                                items = me.items.items;
                            items.forEach(item => {
                                const {name} = item;
                                if (['dpi'].includes(name)) {
                                    item.diySetValue ? (item.diySetValue(data['exportSetting'])) : (item.setValue(data['exportSetting']));
                                } else {
                                    item.diySetValue ? (item.diySetValue(data[name])) : (item.setValue(data[name]));
                                }
                            })
                        },
                        diyGetValue: function () {
                            var me = this,
                                items = me.items.items,
                                result = {};
                            items.forEach(item => result[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                            return result;
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'exportSetting',
                                itemId: 'exportSetting',
                                editable: false,
                                allowBlank: false,
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        'layer',
                                        {
                                            name: 'componentProperties',
                                            type: 'object'
                                        }
                                    ],
                                    data: []
                                }),
                                valueField: 'layer',
                                displayField: 'layer',
                                fieldLabel: i18n.getKey('目标layer'),
                                diySetValue: function (data) {
                                    const me = this;
                                    me.store.proxy.data = data?.layerSettings;
                                    me.store.load();
                                },
                            },
                            {
                                xtype: 'numberfield',
                                name: 'dpi',
                                itemId: 'dpi',
                                fieldLabel: i18n.getKey('dpi'),
                                diySetValue: function (data) {
                                    const me = this;
                                    me.setValue(data?.dpi);
                                },
                            },
                            {
                                xtype: 'textfield',
                                name: 'sizeUnit',
                                itemId: 'sizeUnit',
                                hidden: true,
                                fieldLabel: i18n.getKey('sizeUnit'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                hidden: true,
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'fieldset',
                                name: 'parameters',
                                itemId: 'parameters',
                                width: 600,
                                title: '<font color="green">' + i18n.getKey('请求参数') + '</font>',
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                defaults: {
                                    xtype: 'numberfield',
                                    padding: '10 10 10 25',
                                    labelWidth: 60,
                                    allowBlank: false,
                                },
                                items: [],
                                clearInfo: function () {
                                    const me = this;
                                    me.removeAll();
                                },
                                diySetValue: function (data) {
                                    const me = this;
                                    data.forEach(item => {
                                        var {defaultValue, name, alias, type} = item,
                                            emptyText = '',
                                            emptyTextGather = {
                                                L: '成品線高度(mm)',
                                                W: '成品線寬度(mm)',
                                            };

                                        ['L', 'W'].includes(name) && (emptyText = emptyTextGather[name]);
                                        me.add(
                                            {
                                                xtype: 'numberfield',
                                                fieldLabel: name,
                                                name: name,
                                                itemId: name,
                                                alias: alias,
                                                type: type,
                                                emptyText: emptyText,
                                                value: defaultValue
                                            },
                                        )
                                    })
                                },
                                diyGetValue: function () {
                                    var me = this,
                                        items = me.items.items,
                                        result = {};
                                    items.forEach(item => result[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                                    return result;
                                },
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        itemId: 'result',
                        layout: 'vbox',
                        width: '100%',
                        margin: '40 0 0 0',
                        defaults: {
                            margin: '5 25 5 25',
                        },
                        hidden: true,
                        clearInfo: function () {
                            const me = this,
                                items = me.items.items
                            items.forEach(item => {
                                item.clearInfo && item.clearInfo()
                            })
                            me.setVisible(false);
                        },
                        diySetValue: function (data) {
                            const me = this,
                                textarea = me.getComponent('textarea');
                            textarea.diySetValue(data);
                            me.setVisible(true);
                        },
                        items: [
                            {
                                xtype: 'container',
                                itemId: 'btnTools',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        width: 50,
                                        fieldLabel: i18n.getKey('结果'),
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'copy',
                                        iconCls: 'icon_copy',
                                        text: i18n.getKey('copy'),
                                        ui: 'default-toolbar-small',
                                        hidden: true,
                                        margin: '0 5 0 5',
                                        handler: function (btn, msg, call) {
                                            const resultComp = btn.ownerCt.ownerCt,
                                                textarea = resultComp.getComponent('textarea'),
                                                textareaValue = textarea.getValue()
                                            ;

                                            const input = document.createElement('input');
                                            document.body.appendChild(input);
                                            input.setAttribute('value', textareaValue);
                                            input.select();
                                            if (document.execCommand('copy')) {
                                                document.execCommand('copy');
                                                const isString = typeof msg === 'string';
                                                JSDiyAlert(i18n.getKey('prompt'), isString ? msg : '复制成功', call);
                                            }
                                            document.body.removeChild(input);
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'verify',
                                        iconCls: 'icon_test',
                                        text: i18n.getKey('测试'),
                                        ui: 'default-toolbar-small',
                                        hidden: true,
                                        margin: '0 5 0 5',
                                        handler: function (btn) {
                                            const btnTools = btn.ownerCt,
                                                copyBtn = btnTools.getComponent('copy');
                                            copyBtn.handler(copyBtn, '已复制结果; \n点击确认,将跳转至测试页!', function () {
                                                window.open('https://yqnn.github.io/svg-path-editor');
                                            });
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'textarea',
                                itemId: 'textarea',
                                width: 600,
                                height: 150,
                                labelWidth: 40,
                                labelAlign: 'top',
                                readOnly: true,
                                fieldStyle: 'background-color: silver',
                                clearInfo: function () {
                                    const me = this,
                                        resultComp = me.ownerCt,
                                        btnTools = resultComp.getComponent('btnTools'),
                                        btnToolsItems = btnTools.items.items;

                                    // 隐藏按钮
                                    btnToolsItems.forEach(item => {
                                        item?.itemId && item.setVisible(false)
                                    })
                                    me.diySetValue('');
                                },
                                diySetValue: function (data) {
                                    const me = this,
                                        resultComp = me.ownerCt,
                                        btnTools = resultComp.getComponent('btnTools'),
                                        btnToolsItems = btnTools.items.items;

                                    me.setValue(data);
                                    // 显示隐藏按钮
                                    btnToolsItems.forEach(item => {
                                        item?.itemId && item.setVisible(data)
                                    })
                                }
                            }
                        ]
                    },
                ]
            },
        ];
        me.listeners = {
            afterrender: function (panel) {
                const form = panel.getComponent('form')
                const combo = form.getComponent('template')
                // 默认赋值第一个选项
                !Ext.isEmpty(template) && combo.setValue(template[0]?.name);
            },
        }
        me.callParent();
    }
})
