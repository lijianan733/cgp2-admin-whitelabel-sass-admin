/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeyContainer", {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.keysform',
    requires : [],
    region: 'center',
    border: 0,
    width:'100%',
    data: null,
    initComponent: function () {
        var me = this;
        me.tbar= [
//            '->',
            {
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                handler: function (comp) {
                    me.createKeyRecord(null);
                }
            }
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.data)) {
                comp.setValue(comp.data);
            }
        }
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(data, function (item) {
            me.createKeyRecord(item);
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        var data=[];
        Ext.Array.each(items, function (item) {
            data.push(item.getValue());
        });
        return data;
    },
    createKeyRecord:function(itemData){
        var me=this;
        var items = me.items.items;
        var keyRecord=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeyRecord',{
            data:itemData
        });
        me.insert(items.length, keyRecord);
        return keyRecord;
    }
});
