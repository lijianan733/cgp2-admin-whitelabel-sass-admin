Ext.define('CGP.pagecontentschema.view.batchgeneratepcsstruct.BatchCreateWin',{
    extend: 'Ext.window.Window',
    width: 1000,
    height: 750,
    modal: true,
    layout: 'fit',
    autoShow: true,
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('gameTile')+i18n.getKey('template')+i18n.getKey('create')+'(svg)';
        var controller = Ext.create('CGP.pagecontentschema.view.batchgeneratepcsstruct.Controller');
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('save'),
            itemId: 'BatchCreate',
            iconCls: 'icon_save',
            handler: function(){
                if(me.form.isValid()) {
                    var pageContentSchema = controller.createPageContentSchema(me.form.getValue(),me);
                    controller.savePageContentSchema(pageContentSchema,me);
                }
            }
        }];
        var form = Ext.create('CGP.pagecontentschema.view.batchgeneratepcsstruct.EditForm',{
            border: false
        });
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})
