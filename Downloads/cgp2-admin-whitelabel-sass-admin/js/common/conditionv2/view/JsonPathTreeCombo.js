/**
 * @Description:获取JSonpath属性值的组件
 * @author nan
 * @date 2023/2/8
 */

Ext.define('CGP.common.conditionv2.view.JsonPathTreeCombo', {
    extend: 'Ext.ux.TreeCombo',
    alias: 'widget.jsonpathtreecombo',
    name: 'path',
    itemId: 'path',
    padding: 0,
    editable: false,
    allowBlank: false,
    multiselect: false,
    valueField: 'text',
    displayField: 'text',
    dataIndex: 'name',
    matchFieldWidth: false,
    treePanelConfig: {
        width: 700,
        columns: [
            {
                xtype: 'treecolumn',
                text: '<font color="green">上下文变量</font>',
                dataIndex: 'text',
                width: 250,
                renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    metadata.tdAttr = 'data-qtip=""';
                    return value;
                }
            },
            {
                text: '<font color="green">输入方式</font>',
                width: 100,
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
                width: 100,
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
            }],
        listeners: {
            afterrender: function () {
                var me = this;
                me.expandAll();
            }
        }
    },
    store: null,
    initComponent: function () {
        var me = this;
        me.callParent();
    },
    setValue: function (value) {
        var me = this;
        var arr = [];
        var record = me.tree.getView().getSelectionModel().getSelection()[0];
        if (record) {
            do {
                if (record.isLeaf()) {
                    arr.push('["' + record.get('text').trim() + '"]');
                } else {
                    arr.push(record.get('text').trim());
                }
                record = record.parentNode;
            } while (!record.isRoot());
            arr = arr.reverse();
            var str = arr.pop();
            value = arr.join('.') + str;
            //这里强行调用指定方法，由于是强行写的的，没有EXT类继承体系中的相关字段，无法调用me.callParent
            Ext.form.field.Text.prototype.setValue.apply(this, [value] || []);
        } else {
            Ext.form.field.Text.prototype.setValue.apply(this, [value] || []);
        }
    },
})