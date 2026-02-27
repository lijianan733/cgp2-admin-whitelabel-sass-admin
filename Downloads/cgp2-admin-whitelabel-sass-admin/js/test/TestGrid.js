Ext.define('CGP.test.TestGrid',{
    extend: 'Ext.grid.Panel',
    width: 600,
    height: 500,
    initComponent: function(){
        var me = this;
        me.title = 'testA';
        var store = Ext.create('CGP.attribute.store.LocalAttributeOption',{
            data:[{id: 1,name: 'test1'},{id: 2,name: 'test2'}]
        });
        me.tbar = ['->',{
            xtype: 'button',
            text: 'get',
            handler: function(){
                console.log(me.getSelectionModel().getSelection()[0]);
                console.log(me.getStore().data.items[0]);
                //me.getStore().add([{id: 1,name: 'test2'}])
            }
        },{
            xtype: 'button',
            text: 'getaaa',
            handler: function(){
                me.getStore().data.items[0].set('name','yyyyyyy')
                //console.log(me.getStore().getById(1))
            }
        }];
        me.store = store;
        me.columns =  [
            {
                text : i18n.getKey('id'),
                dataIndex : 'id',
                width : 60,
                itemId : 'id'
            },{
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                itemId: 'name'
            }
        ];
        me.callParent(arguments);
    }
});