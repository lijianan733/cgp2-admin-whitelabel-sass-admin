/**
 * Created by nan on 2019/3/29.
 * 比较的表达的式的container
 */
Ext.define('CGP.common.valueExV2.view.ConditionExpressionContaioner', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.conditionexpressioncontaioner',
    defaults: {},
    name: 'conditionExpression',
    itemId: 'conditionExpression',
    layout: {
        type: 'hbox'
    },
    flex: 5,
    leftStore: null,//目前只支持treeStore
    rightStore: null,//目前只支持treeStore
    initComponent: function () {
        var me = this;
        var operatorStore = Ext.create('CGP.common.valueExV2.store.OperatorStore');
        var leftStore = me.leftStore || Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            rootVisible: false,
            fields: [
                'text', 'value'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: JSJsonToTree(CGP.common.valueExV2.config.Config2.data).children
            }
        });
        var rightStore = me.rightStore || Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            rootVisible: false,
            fields: [
                'text', 'value'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: JSJsonToTree(CGP.common.valueExV2.config.Config2.data).children
            }
        });
        me.items = [
            {
                name: 'left',
                xtype: 'treecombo',
                store: leftStore,
                displayField: 'text',
                valueField: 'text',
                dataIndex: 'text',
                flex: 1,
                multiselect: false,
                allowBlank: false,
                forceSelection: false,
                rootVisible: false,
                selectChildren: false,
                canSelectFolders: true,
                matchFieldWidth: true,
                getValue: function () {
                    return this.getRawValue();
                },
                setRecordsValue: function (view, record, item, index, e, eOpts, treeCombo) {
                    var me = treeCombo;
                    var nodeKey = [];
                    var getDisPlayValue = function (record) {
                        if (record.isRoot()) {//到root节点就终止
                        } else {
                            getDisPlayValue(record.parentNode);
                            nodeKey.push(record.get('text'));
                        }
                    };
                    getDisPlayValue(record);
                    me.setValue('data.' + nodeKey.join('.'));
                    me.fireEvent('itemclick', me, record, item, index, e, eOpts, me.records, me.ids);
                    if (me.multiselect == false) me.onTriggerClick();
                },
                setValue: function (valueInit) {
                    if (typeof valueInit == 'undefined') return;
                    var me = this,
                        tree = this.tree,
                        values = [],
                        valueFin = [];
                    //当需要的值是object的集合时
                    if (!Ext.isEmpty(me.isObj) && me.isObj == true) {
                        me.value = [];
                        Ext.Array.each(valueInit, function (record) {
                            if (Ext.isObject(record)) {
                                values.push(record._id);
                            } else {
                                values = valueInit.split(',');
                            }
                        })
                    } else {
                        values = (Ext.isEmpty(valueInit)) ? [] : valueInit.split(',')
                    }
                    inputEl = me.inputEl;

                    if (tree.store.isLoading()) {
                        me.afterLoadSetValue = valueInit;
                    }

                    if (inputEl && me.emptyText && !Ext.isEmpty(values)) {
                        inputEl.removeCls(me.emptyCls);
                    }

                    if (tree == false) return false;
                    var node = tree.getRootNode();
                    if (node == null) return false;
                    me.recursiveRecords = [];
                    me.recursivePush(node, false);
                    me.records = [];
                    Ext.each(me.recursiveRecords, function (record) {
                        var id = record.get(me.valueField),
                            index = values.indexOf('' + id);

                        if (me.multiselect == true && id > 0) record.set('checked', false);

                        if (index != -1) {
                            valueFin.push(me.recursiveName(record));
                            if (me.multiselect == true && id > 0) {
                                record.set('checked', true);
                                me.addRecord(record);
                            }
                        }
                    });
                    //当需要的值是object的集合时
                    if (!Ext.isEmpty(me.isObj) && me.isObj == true) {
                        me.value = [];
                        Ext.Array.each(me.records, function (record) {
                            me.value.push(record.raw);
                        })
                    } else {
                        me.value = valueInit;
                    }
                    if (Ext.isString(me.value)) {
                        me.setRawValue(me.value)
                    } else {
                        me.setRawValue(valueFin.join(', '));
                    }
                    me.checkChange();
                    me.applyEmptyText();
                    return me;
                }
            },
            {
                xtype: 'combo',
                store: operatorStore,
                matchFieldWidth: true,
                displayField: 'display',
                valueField: 'value',
                editable: false,
                width: 60,
                allowBlank: false,
                name: 'operator',
                padding: '0 10 0 10'
            },

            {
                name: 'right',
                xtype: 'treecombo',
                store: rightStore,
                forceSelection: false,
                displayField: 'text',
                allowBlank: false,
                valueField: 'text',
                dataIndex: 'text',
                flex: 1,
                multiselect: false,
                rootVisible: false,
                matchFieldWidth: true,
                getValue: function () {
                    return this.getRawValue();
                },
                setRecordsValue: function (view, record, item, index, e, eOpts, treeCombo) {
                    var me = treeCombo;
                    var nodeKey = [];
                    var getDisPlayValue = function (record) {
                        if (record.isRoot()) {//到root节点就终止
                        } else {
                            getDisPlayValue(record.parentNode);
                            nodeKey.push(record.get('text'));
                        }
                    };
                    getDisPlayValue(record);
                    me.setValue('data.' + nodeKey.join('.'));
                    me.fireEvent('itemclick', me, record, item, index, e, eOpts, me.records, me.ids);
                    if (me.multiselect == false) me.onTriggerClick();
                },
                setValue: function (valueInit) {
                    if (typeof valueInit == 'undefined') return;
                    var me = this,
                        tree = this.tree,
                        values = [],
                        valueFin = [];
                    //当需要的值是object的集合时
                    if (!Ext.isEmpty(me.isObj) && me.isObj == true) {
                        me.value = [];
                        Ext.Array.each(valueInit, function (record) {
                            if (Ext.isObject(record)) {
                                values.push(record._id);
                            } else {
                                values = valueInit.split(',');
                            }
                        })
                    } else {
                        values = (Ext.isEmpty(valueInit)) ? [] : valueInit.split(',')
                    }
                    inputEl = me.inputEl;

                    if (tree.store.isLoading()) {
                        me.afterLoadSetValue = valueInit;
                    }

                    if (inputEl && me.emptyText && !Ext.isEmpty(values)) {
                        inputEl.removeCls(me.emptyCls);
                    }
                    if (tree == false) return false;
                    var node = tree.getRootNode();
                    if (node == null) return false;
                    me.recursiveRecords = [];
                    me.recursivePush(node, false);
                    me.records = [];
                    Ext.each(me.recursiveRecords, function (record) {
                        var id = record.get(me.valueField),
                            index = values.indexOf('' + id);

                        if (me.multiselect == true && id > 0) record.set('checked', false);

                        if (index != -1) {
                            valueFin.push(me.recursiveName(record));
                            if (me.multiselect == true && id > 0) {
                                record.set('checked', true);
                                me.addRecord(record);
                            }
                        }
                    });
                    //当需要的值是object的集合时
                    if (!Ext.isEmpty(me.isObj) && me.isObj == true) {
                        me.value = [];
                        Ext.Array.each(me.records, function (record) {
                            me.value.push(record.raw);
                        })
                    } else {
                        me.value = valueInit;
                    }
                    if (Ext.isString(me.value)) {
                        me.setRawValue(me.value)
                    } else {
                        me.setRawValue(valueFin.join(', '));
                    }
                    me.checkChange();
                    me.applyEmptyText();
                    return me;
                }
            }
        ];
        me.callParent();
    }
})
