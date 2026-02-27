Ext.define('CGP.partner.view.MailTemplateWin', {
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    autoScroll: false,
    autoShow: true,

    initComponent: function () {
        var me= this;
        var myMask = new Ext.LoadMask(me, {msg: "加载中..."});
       /* me.listeners = {
            show: function(){
                myMask.show();
            }
        };*/
        me.title = i18n.getKey('orderMailTemplate');
        me.items = [Ext.create('CGP.partner.view.MailTemplateTabs',{
            header: false,
            id: 'mailTemplateTabs',
            partnerId: me.partnerId,
            websiteId: me.websiteId,
            myMask: myMask

        })];
        me.callParent(arguments);
    }
});