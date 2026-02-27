/**
 * @Description: 把上下文信息用树形结构展示
 * @author nan
 * @date 2023/6/6
 */
Ext.define("CGP.common.conditionv2.view.ContextTree", {
    extend: 'Ext.tree.Panel',
    alias: 'widget.context_tree',
    uxTextarea: null,//上下文数据写入的目标组件
    rootVisible: false,
    initComponent: function () {
        var me = this;
        me.columns = [
            {
                xtype: 'treecolumn',
                text: '<font color="green">上下文变量</font>',
                dataIndex: 'text',
                width: 200,
                menuDisabled: true,
                renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    metadata.tdAttr = 'data-qtip=""';
                    return value;
                }
            },
            {
                text: '<font color="green">输入方式</font>',
                width: 80,
                menuDisabled: true,
                dataIndex: 'text',
                renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    var record = Ext.data.StoreManager.get('contextStore').findRecord('key', value);
                    if (record) {
                        var selectType = record.get('selectType');
                        if (selectType == 'NON') {
                            return '手输';
                        } else if (selectType == 'SINGLE') {
                            return '单选';
                        } else if (selectType == 'MULTI') {
                            return '多选';
                        }
                    }
                }
            },
            {
                text: '<font color="green">值类型</font>',
                width: 80,
                menuDisabled: true,
                dataIndex: 'text',
                renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    var record = Ext.data.StoreManager.get('contextStore').findRecord('key', value);
                    if (record) {
                        return record.get('valueType');
                    }
                }
            },
            {
                dataIndex: 'text',
                text: '<font color="green">描述</font>',
                flex: 1,
                renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    var record = Ext.data.StoreManager.get('contextStore').findRecord('key', value);
                    if (record) {
                        return record.get('displayName');
                    }
                }
            }];
        me.callParent();
    },
})
