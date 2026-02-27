Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.MVTField',{
    extend: 'Ext.form.FieldContainer',
    alias: ['widget.mvtfield'],
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'center'
    },
    defaults: {},
    designId: null,

    initComponent: function () {
        var me=this;
        var controller=Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        me.items= [
            {
                xtype: 'numberfield',
                flex: 1,
                hideLabel: true,
                itemId: 'targetId',
                margin: '0 5 0 0',
                readOnly: true,
                allowBlank: true,
                hideTrigger:true,
                fieldLabel: i18n.getKey('targetId')
            },
            {
                xtype: 'button',
                text: i18n.getKey('choice'),
                width: 50,
                hidden: me.hideChangeMaterialPath,
                handler: function (btn) {
                    var selectedData = btn.ownerCt.data;
                    var component = btn.ownerCt.getComponent('targetId');
                    controller.showMVTWindow(me.designId, component,selectedData);
                }
            }
        ],
        me.callParent();
    },
    getName: function () {
        return this.name;
    },
    setValue: function (data) {
        var me = this,values='';
        me.data=[];
        if(Ext.isArray(data)){
            me.data=data;
            values=data.map(function (item){
                return item._id;
            }).join(',');
        }
        else if(Ext.isObject(data)){
            me.data.push(data);
            values=data._id;
        }
        me.getComponent('targetId').setValue(values);
    },
    getValue: function () {
        var me = this;
        var values=me.data;
        var realValues=[];
        realValues=values.map(function (v){
            return {_id: v._id,clazz: v.clazz};
        });
        return realValues;
    }
})