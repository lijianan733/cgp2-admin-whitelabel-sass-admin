/**
 * Created by nan on 2018/1/30.
 */
Ext.define('CGP.partnerapplymanage.view.RefuseWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    bodyStyle: 'padding:10px',
    layout: 'fit',

    initComponent: function () {
        var me = this;
        var verifyResult='refuse';
        var partnerStore=me.partnerStore;
        var applicant=me.applicant;
        var recordId =me.recordId;
        var website=me.website;
        me.title =i18n.getKey('REJECTED');
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                autoScroll: true,
                border: false,
                width: 520,
                items: [
                    {
                        xtype: 'displayfield',
                        itemId: 'recordId',
                        value: recordId,
                        fieldLabel: i18n.getKey('id')
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'applicant',
                        value: applicant,
                        fieldLabel: i18n.getKey('applicant')
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'belongWebsite',
                        value: website,
                        fieldLabel: i18n.getKey('belongWebsite')
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'verifyResult',
                        value: i18n.getKey(verifyResult),
                        fieldLabel: i18n.getKey('resultOfAudit')
                    },
                    {
                        xtype: 'textarea',
                        itemId: 'remark',
                        fieldLabel: i18n.getKey('remark'),
                        allowBlank: false,
                        msgTarget: 'side',
                        width: 500,
                        height: 150
                    }
                ]
            }
        ];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('ok'),
                iconCls : 'icon_save',
                handler: function () {
                    var controller = Ext.create('CGP.partnerapplymanage.controller.Controller');
                    window.controller = controller;
                    if (me.form.isValid()) {
                        Ext.MessageBox.confirm(i18n.getKey('prompt'),i18n.getKey('refuseto'),callback);
                        function callback(id){
                            if(id=='yes'){
                                var remark = me.form.getComponent('remark').getValue();
                                var recordId = me.form.getComponent('recordId').getValue();
                                controller.confirmpartnerApplys(recordId, verifyResult, remark,partnerStore,me);
                            }else{
                            }
                        }
                    }else{
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('close'),
                itemId: 'close',
                handler: function () {
                    me.partnerStore.load();
                    me.close();
                }
            }]

        me.callParent(arguments)

        me.form = me.getComponent('form');
    }
})