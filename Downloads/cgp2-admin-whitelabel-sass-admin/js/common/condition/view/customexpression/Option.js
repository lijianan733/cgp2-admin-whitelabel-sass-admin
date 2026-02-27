/**
 * @Description:
 * @author nan
 * @date 2023/10/20
 */
Ext.define('CGP.common.condition.view.customexpression.Option', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.option',
    hideHeaders: false,
    emptyText: '无相关数据',
    attribute: null,//选择上下文的记录
    singleValueFun: null,
    arrayValueFun: null,
    refreshData: function (record) {
        var me = this;
        if (record) {
            if (record.get('selectType') == 'NON') {
                me.store.loadData([]);
            } else if (record.get('selectType') == 'SINGLE' || record.get('selectType') == 'MULTI') {
                var options = record.getData().attrOptions;
                me.store.loadData(options);
            }
            var selectType = record.get('selectType') == 'MULTI' ? '(多选)' : (record.get('selectType') == 'SINGLE' ? '(单选)' : '');
            me.setTitle(`<font color="green">属性选项</font><font color="red">${selectType}</font>`);
            me.attribute = record;
        } else {
            me.store.loadData([]);
            me.attribute = null;
        }
    },
    initComponent: function () {
        var me = this;
        me.tbar = {
            height: 36,
            defaults: {
                maxWidth: 120,
                flex: 1,
            },
            items: [
                {
                    xtype: 'button',
                    text: '单个值',
                    tooltip: '做为单个数值格式写入表达式',
                    iconCls: 'icon_ux_left',
                    margin: '0 5',
                    disabled: true,
                    itemId: 'single',
                    handler: me.singleValueFun || function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        var treeView = treePanel.getView();
                        var extraFeature = treePanel.ownerCt;
                        var selection = treeView.getSelectionModel().getSelection();
                        if (selection.length > 0) {
                            var str = '';
                            var keyType = treePanel.attribute.get('keyType');
                            selection.map(function (item) {
                                if (keyType == 'id') {
                                    str = (item.get('id'));
                                } else {
                                    str = (item.get('value'));
                                }
                            });
                            extraFeature.ownerCt.ownerCt.insertAtCursor(JSON.stringify(str));
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '数组',
                    tooltip: '做为数组格式写入表达式',
                    iconCls: 'icon_ux_left',
                    itemId: 'array',
                    handler: me.arrayValueFun || function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        var treeView = treePanel.getView();
                        var extraFeature = treePanel.ownerCt;
                        var selection = treeView.getSelectionModel().getSelection();
                        if (selection.length > 0) {
                            var keyType = treePanel.attribute.get('keyType');
                            var str = [];
                            selection.map(function (item) {
                                if (keyType == 'id') {
                                    str.push(item.get('id') + '');
                                } else {
                                    str.push(item.get('value'));
                                }
                            });
                            extraFeature.ownerCt.ownerCt.insertAtCursor(JSON.stringify(str));
                        }
                    }
                },
            ]
        };
        me.header = {
            padding: '5px 9px 5px 9px',
            title: '<font color="green">属性选项</font>',
            style: {
                background: '#f5f5f5'
            }
        };
        me.columns = [{
            xtype: 'auto_bread_word_column',
            dataIndex: 'diyDisplayName',
            flex: 1,
            text: '属性值 <属性id>',
            renderer: function (value, metaData, record) {
                return value || (record.get('value') + '<' + record.get('id') + '>');
            }
        }];
        me.selModel = Ext.create("Ext.selection.CheckboxModel", {
            checkOnly: true,
            injectCheckbox: 0,//checkbox位于哪一列，默认值为0
            mode: "multi",//multi,simple,single；默认为多选multi
            allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
        });
        me.store = {
            xtype: 'store',
            fields: ['name', 'value', 'displayValue', 'id', 'diyDisplayName'],
            data: []
        };
        me.callParent();
        me.on('selectionChange', function (selectModel, records) {
            var me = this;
            var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
            toolBar.getComponent('single').setDisabled(records.length != 1)
        })
    }
})