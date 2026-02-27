Ext.define('CGP.product.view.productattributeconstraint.view.customcomp.AttributeValuesFieldContainer',{
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.attributevaluesfieldcontainer',
    initComponent:function(){
        var me = this;

        me.callParent(arguments);
    },
    setArrayValue: function(values){
        var me = this;
        var items = me.items.items;
        Ext.Array.each(values,function(value){
            Ext.Array.each(items,function(item){
                if(value.attributeId == item.name){
                    item.setValue(value.value)
                }
            })
        })
    },
    getArrayValue: function(){
        var me = this;
        var valArr = [];
        var items = me.items.items;
        Ext.Array.each(items,function(item){
            valArr.push({
                clazz: "com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue",
                attributeId: parseInt(item.name),
                value: item.getValue()
            })
        });
        return valArr;
    }

});
