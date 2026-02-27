Ext.define('CGP.product.view.managerskuattribute.view.edit.CusFieldContainer',{
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.cusfieldcontainer',
    initComponent: function(){
        var me = this;
        me.callParent(arguments);
    },
    setValue: function(data){
        var me = this;
        var items = me.items.items;
        if(!Ext.isEmpty(data)){
            Ext.Array.each(items,function(item){
                if(!item.rendered){
                    item.on('render',function(){
                        item.setValue(data[item.name]);
                    });
                }else{
                    item.setValue(data[item.name]);
                }
            })
        }
    },
    getValue: function(){
        var me = this;
        var items = me.items.items;
        var data = {};
        Ext.Array.each(items,function(item){
            if(item.name == 'relatedAttributeIds' && item.hidden){

            }else{
                data[item.name] = item.getValue();
            }
        });
        return data;
    }
});