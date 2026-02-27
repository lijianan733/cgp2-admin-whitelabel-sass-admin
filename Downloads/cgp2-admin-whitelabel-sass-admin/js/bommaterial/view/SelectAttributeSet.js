Ext.define("CGP.bommaterial.view.SelectAttributeSet",{
    extend: "Ext.form.Panel",
    title: '选择Bom物料属性集',
    region: 'center',
    defaults: {
        style: 'margin: 20px',
        width: 300
    },

    initComponent: function(){
        var me = this;

        me.items= [
            {
                name: 'BomAttributeSets',
                itemId: 'BomAttributeSets',
                xtype: 'combo',
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                store: Ext.create('CGP.bommaterial.store.BomAttributeSets'),
                fieldLabel: i18n.getKey('bomMaterialAttributeSet'),
                editable: false
            }
        ]
        /**
         *点击 下一步 配置物料完整信息
         */
        me.tbar= [
            {
                xtype: 'button',
                text: i18n.getKey('nextStep'),
                handler: function () {
                    var form = this.ownerCt.ownerCt;
                    //验证form
                    if (form.getForm().isValid()) {
                        me.controller.createBomMaterialNextStep(form);
                    }
                }
            },{
                xtype: 'button',
                text: i18n.getKey('copy'),
                handler: function(){
                    Ext.create('CGP.bommaterial.view.SelectMaterialCopyWin',{
                        controller: me.controller
                    }).show();
                }
            }
        ];
        me.callParent(arguments);
    }
})