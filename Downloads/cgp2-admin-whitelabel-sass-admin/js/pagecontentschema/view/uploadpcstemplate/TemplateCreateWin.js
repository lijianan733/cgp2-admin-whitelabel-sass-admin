Ext.define('CGP.pagecontentschema.view.uploadpcstemplate.TemplateCreateWin',{
    extend: 'Ext.window.Window',
    width: 1000,
    height: 750,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('upload')+i18n.getKey('PCS')+i18n.getKey('create');
        var controller = Ext.create('CGP.pagecontentschema.view.batchgeneratepcsstruct.Controller');
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('create'),
            itemId: 'BatchCreate',
            iconCls: 'icon_save',
            handler: function(){
                if(me.form.isValid()) {
                    var pageContentSchema = me.form.getValue();
                    controller.savePageContentSchema(pageContentSchema,me);
                }
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            itemId: 'cancel',
            iconCls: 'icon_cancel',
            handler: function(){
                me.close();
            }
        }];
        var form = Ext.create('CGP.pagecontentschema.view.uploadpcstemplate.TemplateForm',{
            border: false
        });
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})
