/**
 * @Description:
 * @author nan
 * @date 2022/11/4
 */
Ext.define('CGP.common.typesettingschedule.view.DiyFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.diyfieldset',
    collapsible: true,
    border: '1 0 0 0 ',
    collapsed: true,
    layout: 'fit',
    jsonTreePanelConfig: null,
    setValue: function (data) {
        var me = this;
        // me.expand();
        if (data) {
            me.items.items[0].value = Ext.clone(data);
            me.items.items[0].getStore().getRootNode().appendChild(JSJsonToTree(data).children);
            me.show();
        } else {
            me.hide();
        }
    },
    initComponent: function () {
        var me = this;
        me.title = "<div style= 'margin-top: 3px;font-size:15px;color:green;font-weight: bold'>" + me.title + '</div>';
        var btns = [
            {
                index: 0,
                config: {
                    xtype: 'button',
                    text: i18n.getKey('expand子节点'),
                    iconCls: 'icon_expand',
                    count: 0,//展开的次数
                    hidden: true,
                    expandableNode: [],//一个可展开的节点的数组
                    handler: function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        if (btn.count == 0) {
                            var rootNode = treePanel.getRootNode();
                            rootNode.eachChild(function (item) {
                                if (item.isLeaf() == true) {
                                } else {
                                    item.expand();
                                    btn.expandableNode.push(item);
                                }
                            })
                            btn.count++;
                        } else {
                            var expandableNode = [];
                            for (var i = 0; i < btn.expandableNode.length; i++) {
                                var itemNode = btn.expandableNode[i];
                                itemNode.eachChild(function (item) {
                                    if (item.isLeaf() == true) {
                                    } else {
                                        item.expand();
                                        expandableNode.push(item);
                                    }
                                })
                            }
                            btn.expandableNode = expandableNode;
                            btn.count++;
                        }

                    }
                }
            },
            {
                index: 2,
                config: {
                    xtype: 'button',
                    text: i18n.getKey('check') + i18n.getKey('源JSON'),
                    iconCls: 'icon_check',
                    handler: function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        var valueString = JSON.stringify(treePanel.value, null, "\t");
                        var win = Ext.create("Ext.window.Window", {
                            id: "pageContentInstanceRange",
                            modal: true,
                            layout: 'fit',
                            title: i18n.getKey('check') + i18n.getKey('源JSON'),
                            items: [
                                {
                                    xtype: 'textarea',
                                    fieldLabel: false,
                                    width: 600,
                                    height: 400,
                                    value: valueString
                                },
                            ],
                            bbar: ['->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('copy'),
                                    iconCls: 'icon_copy',
                                    handler: function (btn) {
                                        const range = document.createRange();
                                        var dom = btn.ownerCt.ownerCt.el.query('textarea')[0]; //拿到包裹文字的那一段容器
                                        range.selectNode(dom); //获取复制内容的 id 选择器
                                        const selection = window.getSelection();  //创建 selection对象
                                        if (selection.rangeCount > 0) selection.removeAllRanges(); //如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
                                        selection.addRange(range); //将range对象添加到selection选区当中，会高亮文本块
                                        document.execCommand('copy'); //复制选中的文字到剪贴板
                                        Ext.Msg.alert('prompt', '复制成功');
                                    }
                                }
                            ]
                        });
                        win.show();
                    }
                }
            }
        ];
        me.items = [Ext.Object.merge({
            xtype: 'jsontreepanel',
            showValue: true,//默认只显示key
            canAddNode: false,
            editable: false,
            keyColumnConfig: {
                editable: false,
                flex: 1
            },
            valueColumnConfig: {
                renderer: function (value) {
                    return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                },
                flex: 3
            },
            extraBtn: btns
        }, me.jsonTreePanelConfig)];
        me.callParent();
    }
})