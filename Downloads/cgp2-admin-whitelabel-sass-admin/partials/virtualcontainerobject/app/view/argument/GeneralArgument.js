/**
 * Created by miao on 2021/10/11.
 */
Ext.Loader.setPath('CGP.virtualcontainerobject', '../../../app');
Ext.define("CGP.virtualcontainerobject.view.argument.GeneralArgument", {
    extend: 'Ext.form.Panel',
    alias: 'widget.generalargument',
    width:'100%',
    rtTypeId: null,
    initComponent: function () {
        var me = this;
        var lefTree = Ext.create('CGP.virtualcontainerobject.view.argument.LeftTree', {
            itemId: 'leftTree',
            name:'leftTree',
            header: false,
            height: 280,
            // hidden:true
        });
        me.items = [
            lefTree,
        ];
        me.callParent(arguments);
    },

    setValue: function (data) {
        var me=this;
        me.data=data;
        for(var item of me.items.items){
            if(!item.hidden&&item.name=='leftTree'){
                item.setValue(data);
            }
        }
    },
    getValue:function (){
        var me=this,data={};
        data=me.data;
        for(var item of me.items.items){
            if(!item.hidden&&item.name=='leftTree'){
                data=item.getValue();
            }
        }
        return data;
    }
})
