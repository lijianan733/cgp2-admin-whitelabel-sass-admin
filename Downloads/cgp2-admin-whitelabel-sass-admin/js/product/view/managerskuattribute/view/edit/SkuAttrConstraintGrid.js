Ext.define('CGP.product.view.managerskuattribute.view.edit.SkuAttrConstraintGrid',{
    extend: 'Ext.grid.Panel',
    //hearder: false,
    bodyStyle: 'border-color:silver;',
    header: {
        style: 'background-color:white;',
        color: 'black',
        border: '0 0 0 0'
    },
    hidden: true,
    initComponent: function(){
        var me = this;
        me.store = Ext.create('Ext.data.Store',{
            model: 'CGP.product.view.managerskuattribute.model.SkuAttributeConstraint',
            proxy: {
                type: 'memory'
            },
            data: []
        });
        var columns = [{
            xtype: 'actioncolumn',
            itemId: 'actioncolumn',
            sortable: false,
            resizable: false,
            width: 70,
            menuDisabled: true,
            items: [
                {
                    iconCls: 'icon_edit icon_margin',
                    tooltip: i18n.getKey('edit'),
                    handler: function (view, rowIndex, colIndex, a, b, record) {
                        var store = me.getStore();
                        var editOrNew = 'edit';
                        me.controller.editConstraintWin(editOrNew,null,me.skuAttributeId,null,me.commonStore,record,me.configurableId,me.tabPanel)
                    }
                },
                {
                    iconCls: 'icon_remove icon_margin',
                    itemId: 'actiondelete',
                    tooltip: i18n.getKey('remove'),
                    handler: function (view, rowIndex, colIndex, a, b, record) {
                        var store = view.getStore();
                        var constraintId = record.getId();
                        Ext.Msg.confirm('提示', '确定删除？', callback);
                        function callback(id) {
                            if(id === 'yes'){
                                me.controller.deleteContraint(me.commonStore,constraintId);
                            }
                        }
                    }
                }
            ]
        },
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                xtype: 'gridcolumn',
                itemId: '_id'
            },{
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                itemId: 'name'
            },{
                text: i18n.getKey('messageTemplate'),
                dataIndex: 'messageTemplate',
                xtype: 'gridcolumn',
                itemId: 'messageTemplate'
            },{
                text: i18n.getKey('type'),
                dataIndex: 'clazz',
                width: 150,
                xtype: 'gridcolumn',
                itemId: 'clazz',
                renderer:function(value){
                    var type = value.split('.').pop();
                    if(type == 'OptionConstraint'){
                        type = i18n.getKey('optionConstraint');
                    }else if(type == 'RangeConstraint'){
                        type = i18n.getKey('rangeConstraint');
                    }else if(type == 'RegexConstraint'){
                        type = i18n.getKey('regexConstraint');
                    }
                    return '<font color=green>'+type+'</font>';
                }
            }];
        me.columns = Ext.Array.merge(columns,me.addColumns);
        me.callParent(arguments);

    },
    /**
     * 当约束store加载结束后，更新该grid的展示数据
     * @param {Array} data 该约束grid的数据
     */
    refreshData: function(data){
        var me = this;
        var store = me.getStore();
        store.removeAll();
        if(Ext.isEmpty(data)){
            me.setVisible(false);
        }else{
            me.setVisible(true);
            store.add(data);
        }
    }
});