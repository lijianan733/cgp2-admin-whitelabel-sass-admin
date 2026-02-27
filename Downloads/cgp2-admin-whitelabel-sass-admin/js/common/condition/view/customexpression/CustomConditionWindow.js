/**
 * @Description:
 * @author nan
 * @date 2023/10/11
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.customexpression.CustomConditionContentGrid',
    'CGP.common.condition.view.customexpression.HelpInfo',
    'CGP.common.condition.view.customexpression.togglebuttoncontainer',
    'CGP.common.condition.view.customexpression.Template',
    'CGP.common.condition.view.customexpression.Operator',
    'CGP.common.condition.view.customexpression.Option',
    'CGP.common.condition.view.customexpression.Detail',
    'CGP.common.condition.view.UseTemplateBtn',
    'CGP.common.field.TextareCodemirror',
    'CGP.common.condition.view.customexpression.CustomProfileContentTreePanel',
    /*   'CGP.common.condition.view.customexpression.MMVTInfo'*/
])

Ext.define('CGP.common.condition.view.customexpression.CustomConditionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.custom_condition_window',
    width: 1000,
    height: 600,
    title: '表达式编辑',
    layout: {
        type: 'border'
    },
    contextType: 'normal',//normal普通上下文 profile产品profile上下文,
    profileStore: null,//profile的产品属性信息
    maximizable: true,
    modal: true,
    constrain: true,
    contentAttributeStore: null,
    initData: '',
    saveHandler: null,
    panelTools: {
        formatBtn: null,
        useHelpBtn: null,
        builtFunBtn: null,
        validTextBtn: null,
        useTemplateBtn: null,
        mmvtInfoBtn: {
            hidden: false,
        }
    },
    optionConfig: null,
    operatorConfig: null,
    templateConfig: null,
    detailConfig: null,
    /**
     * 上下文配置数据 xxx为上下文中keyType作为标识，如skuIdContextPanelCfg,skuCodeContextPanelCfg
     * contentPanel:{
     *    xxxContextPanelCfg:{}//custom_condition_contentGrid
     *
     * }
     */
    contentPanel: null,
    bbar: {
        xtype: 'bottomtoolbar',
        saveBtnCfg: {
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                if (win.isValid()) {
                    var str = win.getValue();
                    win?.saveHandler(str);
                    win.close();
                }
            }
        }
    },
    isValid: function () {
        var me = this;
        var str = me.getValue();
        var controller = Ext.create('CGP.common.condition.controller.Controller');
        str = controller.buildCompleteFunction(str);
        var isValid = JSValidExpression(str, me.contentAttributeStore);
        return isValid;
    },
    getValue: function () {
        var win = this;
        var expressionPanel = win.getComponent('expression');
        var calculationExpression = expressionPanel.getComponent('calculationExpression');
        var str = calculationExpression.codeMirror.getValue();
        return str;
    },
    setValue: function (data) {
        var me = this;
        var calculationExpression = me.query('[itemId=calculationExpression]');
        calculationExpression.setValue(data);
    },
    /**
     * 指定位置插入文本
     * @param myValue
     */
    insertAtCursor: function (myValue) {
        var me = this;
        //IE 浏览器
        var expression = me.down('[itemId=calculationExpression]');
        var course = expression.codeMirror.getCursor();
        var strLength = myValue.length;
        if (expression.codeMirror.getSelection()) {
            var range = expression.codeMirror.listSelections()[0];
            expression.codeMirror.replaceSelection(myValue);
            expression.codeMirror.setCursor(course.line, range.anchor.ch + strLength);
        } else if (expression.codeMirror.getCursor()) {//有鼠标鼠标光标位置
            expression.codeMirror.replaceRange(myValue, expression.codeMirror.getCursor());
            expression.codeMirror.setCursor(course.line, course.ch + strLength);
        }
        expression.codeMirror.focus();
    },

    /**
     * 获取显示上下文内容组件
     * 分为tree和普通平铺出来的
     *
     */
    buildContextPanel: function () {
        var me = this;
        me.contentAttributeStore = me.contentAttributeStore || Ext.create('CGP.common.condition.store.ContentAttributeStore', {
            data: []
        });
        var map = {};
        //以全局上下文中keyType为标识
        me.contentAttributeStore.each(function (item) {
            var keyType = item.get('keyType');
            map[keyType] = map[keyType] || [];
            map[keyType].push(item.raw);
        });
        //普通上下文列表,

        var normalContextItems = [];
        for (var i in map) {
            var store = Ext.create('CGP.common.condition.store.ContentAttributeStore', {
                data: map[i]
            });
            var keyTypeDisplay = map[i][0]?.keyTypeDisplay || i;//取上下文的keyType显示名
            var cfg = Ext.Object.merge({
                xtype: 'custom_condition_contentGrid',
                itemId: `${i}ContextPanelCfg`,
                store: store,
                header: {
                    style: {
                        background: '#f5f5f5'
                    },
                    title: `<font color="red">上下文类型：${keyTypeDisplay}</font>`,
                },
                columns: [{
                    dataIndex: 'displayName',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        var attribute = record.raw;
                        var skuAttr = attribute?.attributeInfo;
                        metaData.tdAttr = '';
                        var keyType = record.get('keyType');
                        var productAttrType = '';
                        var data = [{
                            title: '属性Id',
                            value: skuAttr?.id
                        }, {
                            title: '显示名',
                            value: skuAttr.displayName
                        }, {
                            title: '代码',
                            value: skuAttr?.code
                        }];
                        // 描述属性，非sku属性，sku属性
                        if (keyType == 'skuId' || keyType == 'skuCode') {
                            if (record.get('isSku') == true) {
                                productAttrType = '<font color="green">sku属性</font>'
                            } else if (record.get('isSku') == false) {
                                productAttrType = '<font color="red">非sku属性</font>'
                            } else if (record.get('isDesc') == true) {
                                productAttrType = '<font color="orange">描述性属性</font>'
                            }
                            if (productAttrType) {
                                data.push({
                                    title: '类型',
                                    value: productAttrType
                                });
                            }
                        }

                        return JSCreateHTMLTable(data);
                    },
                }],
            }, me.contentPanel?.[i + 'ContextPanelCfg']);
            normalContextItems.push(cfg);
        }
        var result = {};
        if (me.contextType == 'normal') {
            result = {//列表上下文
                xtype: 'panel',
                layout: {
                    type: 'accordion',
                    titleCollapse: true,
                },
                tbar: {
                    enableOverflow: true,
                    defaults: {
                        maxWidth: 200,
                        flex: 1,
                        width: 120,
                        minWidth: 120,
                    },
                    listeners: {
                        afterrender: function () {
                            //统一加上事件监听
                            var toolbar = this;
                            var arr = toolbar.query('[emptyText]');
                            var dealFun = function (field, newValue, oldValue) {
                                var filters = [];
                                arr.map(function (item) {
                                    var data = item.getValue();
                                    if (!Ext.isEmpty(data)) {
                                        filters.push({
                                            key: item.name,
                                            value: data
                                        });
                                    }
                                });
                                idContentStore.clearFilter();
                                //过滤出符合的记录
                                idContentStore.filter(function (record) {
                                    var isValid = true;
                                    var skuAttribute = record.raw.attributeInfo;
                                    if (skuAttribute) {
                                        filters.map(function (filter) {
                                            if (((skuAttribute[filter.key] + '').toLowerCase()).indexOf((filter.value + '').toLowerCase()) != -1) {
                                            } else {
                                                isValid = false;
                                            }
                                        });
                                    }
                                    return isValid;
                                });
                                codeContentStore.clearFilter();
                                codeContentStore.filter(function (record) {
                                    var isValid = true;
                                    var skuAttribute = record.raw.attributeInfo;
                                    if (skuAttribute) {
                                        filters.map(function (filter) {
                                            if (((skuAttribute[filter.key] + '').toLowerCase()).indexOf((filter.value + '').toLowerCase()) != -1) {
                                            } else {
                                                isValid = false;
                                            }
                                        });
                                    }
                                    return isValid;
                                });
                                var panel = toolbar.ownerCt;
                                if (panel.items.items[0].collapsed == false) {
                                    panel.items.items[0].fireEvent('expand');
                                }
                                if (panel.items.items[1].collapsed == false) {
                                    panel.items.items[1].fireEvent('expand');
                                }

                            };
                            arr.map(function (field) {
                                field.on('change', dealFun);
                            });
                        }
                    },
                    items: [
                        {
                            name: 'code',
                            xtype: 'textfield',
                            itemId: 'code',
                            emptyText: 'SKU属性代码查询'
                        },
                        {
                            name: 'displayName',
                            xtype: 'textfield',
                            itemId: 'displayName',
                            emptyText: 'SKU显示名查询'
                        }, {
                            xtype: 'numberfield',
                            name: 'id',
                            hideTrigger: true,
                            autoStripChars: true,
                            allowExponential: false,
                            allowDecimals: false,
                            itemId: 'id',
                            emptyText: 'SKU属性Id查询'
                        }
                    ]
                },
                region: 'center',
                minWidth: 200,
                height: '100%',
                itemId: 'content',
                items: normalContextItems,
                listeners: {
                    //如果有多个子列表,显示第一个
                    afterrender: function () {
                        var me = this;
                        var items = me.items.items;
                        for (var i = 0; i < items.length; i++) {
                            console.log('xxxxxxxx')
                            if (items[i].isVisible() == true) {
                                items[i].expand();
                                items[i].view.refresh()
                                break;
                            }
                        }
                    }
                }
            };
        } else if (me.contextType == 'profile') {
            result = {//tree状上下文
                xtype: 'panel',
                layout: {
                    type: 'fit'
                },
                region: 'center',
                minWidth: 250,
                height: '100%',
                itemId: 'content',
                items: [
                    {
                        xtype: 'custom_profile_content_treepanel',
                        profileStore: me.profileStore,
                    }
                ],
            };
        }
        return result;
    },
    /**
     * 显示属性相关的具体信息
     */
    buildAttributeInfoPanel: function () {
        var me = this;
        var option = Ext.Object.merge(
            {
                xtype: 'option',
                itemId: 'option',
                hidden: false,
                collapsed: false,
            },
            me.optionConfig
        );
        var operator = Ext.Object.merge(
            {
                xtype: 'operator',
                itemId: 'operator',
            },
            me.operatorConfig
        );
        var detail = Ext.Object.merge({
            xtype: 'detail',
            itemId: 'detail',
        }, me.detailConfig);
        var template = Ext.Object.merge(
            {
                xtype: 'template',
                itemId: 'template',
                header: {
                    padding: '5px 9px 5px 9px',
                    height: 36,
                    title: '<font color="green">示例模板</font>',
                    style: {
                        background: '#f5f5f5'
                    }
                },
                hidden: !(me.contextType == 'normal')
            },
            me.templateConfig
        );
        return {
            //属性详情相关内容
            xtype: 'panel',
            region: 'east',
            split: true,
            flex: 1,
            title: '<font color="red">上下文相关信息</font>',
            header: {
                style: {
                    background: '#f5f5f5'
                }
            },
            collapsible: true,
            spit: true,
            itemId: 'extraFeature',
            layout: {
                type: 'accordion',
                titleCollapse: true,
                animate: true,
                multi: true,
                fill: false
            },
            defaults: {
                flex: 1,
                hidden: false,
                collapsed: true,
                autoScroll: true,
            },
            items: [option, operator, detail, template],
            listeners: {
                afterrender: function () {
                    var me = this;
                    //批量添加展开铺满功能按钮
                    me.items.items.map(function (item) {
                        item.header.insert(1, {
                            xtype: 'button',
                            iconCls: 'icon_arrow_out',
                            componentCls: 'btnOnlyIcon',
                            toolTip: '扩展',
                            listeners: {
                                el: {
                                    click: function (event, el) {
                                        event.stopPropagation()
                                    }
                                }
                            },
                            handler: function (btn) {
                                var panel = this.ownerCt.ownerCt;
                                panel.expand();
                                var outPanel = panel.ownerCt;
                                outPanel.items.items.map(function (item) {
                                    if (item != panel) {
                                        item.collapse();
                                    }
                                });
                            }
                        });
                    });
                }
            }
        };
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                region: 'west',
                flex: 1,
                minWidth: 250,
                minHeight: 150,
                split: true,
                weight: 1,
                itemId: 'expression',
                layout: {
                    type: 'fit',
                },
                tbar: {
                    enableOverflow: true,
                    items: [
                        Ext.Object.merge({
                            xtype: 'button',
                            text: '校验语法',
                            iconCls: 'icon_test',
                            itemId: 'validate',
                            handler: function (btn) {
                                var panel = btn.up('[itemId=expression]');
                                var win = panel.ownerCt;
                                if (win.isValid() == true) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), '合法表达式');
                                }
                            }
                        }, me.panelTools.validTextBtn),
                        Ext.Object.merge({
                            xtype: 'usetemplatebtn',
                            text: '使用模板',
                            saveHandler: function (expression, win) {
                                var me = this;
                                var panel = me.up('[itemId=expression]');
                                panel.ownerCt.insertAtCursor(expression);
                                win.close();
                            },
                            getTextareaFun: function () {
                                var me = this;
                                var panel = me.up('[itemId=expression]');
                                return panel.getComponent('calculationExpression');
                            }
                        }, me.panelTools.useTemplateBtn),
                        Ext.Object.merge({
                            xtype: 'button',
                            text: '格式化',
                            iconCls: 'icon_config',
                            handler: function (btn) {
                                var panel = btn.up('[itemId=expression]');
                                var calculationExpression = panel.getComponent('calculationExpression');
                                var tabchar = ' ';
                                var tabsize = '4';
                                calculationExpression.setValue(window.js_beautify(calculationExpression.getValue(), tabsize, tabchar));
                            }
                        }, me.panelTools.formatBtn),
                        Ext.Object.merge({
                            xtype: 'button',
                            text: '内置方法',
                            iconCls: 'icon_config',
                            menu: [
                                {
                                    text: 'isContained',
                                    iconCls: 'icon_export',
                                    tooltip: '数组里面是否包含指定数据;' +
                                        '<br>例如:指定数据为非数组,isContained(["数据1","数据3","数据3"],attrs["Box_Type"]);' +
                                        '<br>当目标数据为数组时,isContained(["数据1","数据3","数据3"],attrs["Box_Type"]);',
                                    handler: function (btn) {
                                        var panel = btn.up('[itemId=expression]');
                                        var str = ' isContained(["数据1","数据2","数据3"],attrs["Box_Type"]) ';
                                        panel.ownerCt.insertAtCursor(str);
                                    }
                                },
                                {
                                    text: 'equal',
                                    iconCls: 'icon_export',
                                    tooltip: '判断两数组里面数据是否相同;<br>例如:equal([a1,a2,a3],attrs["Box_Type"])',
                                    handler: function (btn) {
                                        var panel = btn.up('[itemId=expression]');
                                        var str = ' equal([数据1,数据2,数据3],attrs["Box_Type"]) ';
                                        panel.ownerCt.insertAtCursor(str);
                                    }
                                }
                            ]
                        }, me.panelTools.builtFunBtn),
                        Ext.Object.merge({
                            xtype: 'button',
                            text: 'MMVT上下文详情',
                            iconCls: 'icon_help',
                            handler: function () {
                                var controller = Ext.create('CGP.common.condition.controller.Controller');
                                controller.showMMVTInfo();
                            }
                        }, me.panelTools.mmvtInfoBtn),
                        Ext.Object.merge({
                            xtype: 'button',
                            text: '使用帮助',
                            iconCls: 'icon_help',
                            handler: function () {
                                var controller = Ext.create('CGP.common.condition.controller.Controller');
                                controller.showHelpInf();
                            }
                        }, me.panelTools.useHelpBtn),
                        '->',
                        {
                            text: '切换',
                            tooltip: '切换布局',
                            handler: function (btn) {
                                var me = this;
                                var panel = me.up('[itemId=expression]');
                                //交互百分比
                                var tag = panel.region;
                                panel.setBorderRegion(panel.region == 'north' ? 'west' : 'north');
                                if (tag == 'north') {
                                    //变成水平
                                    panel.setWidth(panel.ownerCt.getWidth() / 2);
                                } else {
                                    //变成垂直
                                    panel.setHeight(150)
                                }

                            }
                        },
                        {
                            text: '()',
                            tooltip: '加上()或为选中文本加上()',
                            handler: function (btn) {
                                var me = this;
                                var panel = me.up('[itemId=expression]');
                                var textarea = panel.down('[itemId=calculationExpression]');
                                var str = textarea.codeMirror.getSelection();
                                textarea.codeMirror.replaceSelection(`(${str})`);
                            }
                        },
                        {
                            text: '||',
                            tooltip: '加上||或替换为||',
                            handler: function (btn) {
                                var me = this;
                                var panel = me.up('[itemId=expression]');
                                panel.ownerCt.insertAtCursor('||');
                            }
                        },
                        {
                            text: '&&',
                            tooltip: '加上&&或替换为&&',
                            handler: function (btn) {
                                var me = this;
                                var panel = me.up('[itemId=expression]');
                                panel.ownerCt.insertAtCursor('&&');
                            }
                        }

                    ]
                },
                items: [
                    {
                        xtype: 'textarea_codemirror',
                        name: 'calculationExpression',
                        itemId: 'calculationExpression',
                        grow: true,
                        value: me.initData,
                        msgTarget: 'none',
                        emptyText: JSTransformHtml('例如：function expression(args){return (args.context["134988"]);}或者直接写args.context["134988"]'),
                        diySetValue: function (data) {
                            var me = this;
                            var controller = Ext.create('CGP.common.condition.controller.Controller');
                            var str = controller.buildCompleteFunction(data);
                            me.setValue(str);
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = this.getValue();
                            var controller = Ext.create('CGP.common.condition.controller.Controller');
                            var str = controller.splitFunctionBody(data);
                            return str;
                        },
                    }
                ],
            },
            {
                //右侧上下文相关内容区域
                xtype: 'panel',
                region: 'center',
                flex: 1,
                layout: {
                    type: 'border'
                },
                split: true,
                weight: 2,
                minWidth: 400,
                minHeight: 200,
                itemId: 'contentPanel',
                items: [
                    //上下文展示
                    me.buildContextPanel(),
                    me.buildAttributeInfoPanel()
                ],
            }
        ];
        me.callParent();
    }
})
