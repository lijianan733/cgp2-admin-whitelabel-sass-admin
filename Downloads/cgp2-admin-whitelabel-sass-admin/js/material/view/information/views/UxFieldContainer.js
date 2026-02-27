Ext.define('CGP.material.view.information.views.UxFieldContainer',{
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.uxfieldcontainer1',
    value: null,

    initComponent: function(){
        var me = this;
        me.callParent(arguments);
    },
    getValue: function(data){
        var me = this;
        //var rtTypeTitle = me.down('form').getComponent('rtTypeTitle').getValue();
        var data = {};
        var items = me.down('form').items.items;
        Ext.Array.each(items,function(item){
            data[item.name] =  item.getValue();
        });
        return data;
    },
    setValue: function(data){
        var me = this;
        var items = me.down('form').items.items;
        Ext.Array.each(items,function(item){
            if(item.xtype == 'uxfieldcontainer'){
                item.down('form').on('afterlayout',function(){
                    item.setValue(data[item.name]);
                })
            }else{
                if(data){
                    item.setValue(data[item.name])
                }
            }
            //item.setValue(data[item.name])
        })
    }
});