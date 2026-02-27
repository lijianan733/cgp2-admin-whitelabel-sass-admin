/**
 * BatchGrid
 * @Author: miao
 * @Date: 2022/3/30
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.BatchGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.batchgrid',
    columnsConfig:null,

    constructor: function () {
        var me = this;
        me.rowIndexArr = [];
        me.callParent(arguments);

    },
    initComponent: function () {
        var me = this;
        me.tbar = me.tbarConfig||[
            {
                xtype: 'button',
                itemId:'add',
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                count: 0,
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    grid.store.add({
                        rawRowNumber: btn.count
                    });
                    grid.rowIndexArr.push(btn.count);
                    btn.count++;
                }
            }
        ];

        me.columns = [
            {
                xtype: 'actioncolumn',
                width: 35,
                items: [
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'remove',
                        hidden: me.deleteAction,
                        handler: function (gridView, rowIndex, colIndex, a, b, record) {
                            var store = gridView.ownerCt.store;
                            var grid = gridView.ownerCt;
                            var rawRowNumber = record.raw.rawRowNumber;
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    store.remove(record);
                                    me.rowIndexArr.remove(grid.rowIndexArr.indexOf(rawRowNumber));
                                }
                            }
                        }
                    }
                ]
            }
        ];
        me.columns = me.columns.concat(me.columnsConfig);
        me.callParent(arguments);
        if(me.store.data&&me.store.count()>0){
            me.store.each(function (record){
                me.rowIndexArr.push(record.get('rawRowNumber'));
            });
            me.getDockedItems('toolbar[dock="top"]')[0].getComponent("add").count=me.store.max("rawRowNumber")+1;
        }

    },
    isValid: function () {
        var me = this, isValid =true;
        var colCount = me.columns.length;

        for (var i = 0; i < me.rowIndexArr.length; i++) {
            var rowIndex = me.rowIndexArr[i];
            var item = {};
            for (var j = 0; j < colCount; j++) {
                var editor = me.query('[itemId=' + (rowIndex + '_' + j) + ']')[0];
                if (editor) {
                    if(!editor.allowBlank&&!editor.isValid()){
                        isValid =false;
                    }
                }
            }
        }
        return isValid;
    },
    getValue: function () {
        var me = this, result = [];
        var colCount = me.columns.length;

        for (var i = 0; i < me.rowIndexArr.length; i++) {
            var rowIndex = me.rowIndexArr[i];
            var item = {};
            for (var j = 0; j < colCount; j++) {
                var editor = me.query('[itemId=' + (rowIndex + '_' + j) + ']')[0];
                if (editor) {
                    //处理特殊的字段
                    if (editor.xtype == 'conditionfieldv3') {
                        var conditionDTO = editor.getValue();
                        if (conditionDTO) {
                            item[editor.name] = conditionDTO;
                            item['condition'] = editor.getExpression();
                        }
                    } else {
                        if (editor.diyGetValue) {
                            item[editor.name] = editor.diyGetValue();
                        } else {
                            item[editor.name] = editor.getValue();
                        }
                    }
                }
            }

            result.push(item);
        }
        return result;
    },

});