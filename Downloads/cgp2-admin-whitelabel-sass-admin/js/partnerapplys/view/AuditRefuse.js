Ext.define('CGP.partnerapplys.view.AuditRefuse', {
    extend: 'Ext.window.Window',
    alias: 'widget.Auditwindow',

    modal: true,
    bodyStyle: 'padding:10px',
    layout: 'fit',
    
    initComponent: function () {
         var me = this,
            partneremail = this.partneremail,
            partnerId    = this.partnerId,
            partnername  = this.partnername;

         me.title =i18n.getKey('REJECTED');
        

        me.items = [{
                xtype: 'form',
                itemId: 'form',
                border: false,
                width:680,
                items: [
                    {
                        xtype: 'displayfield',
                        itemId: 'partnerId',
                        value: partnerId,
                        fieldLabel: i18n.getKey('partnerId')
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'partnername',
                        value: partnername,
                        fieldLabel: i18n.getKey('name')
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'partneremail',
                        value: partneremail,
                        fieldLabel: i18n.getKey('email')
                    },
                    {
                        xtype: 'textarea',
                        itemId: 'reason',
                        fieldLabel: i18n.getKey('reason'),
                        allowBlank:false,
                        msgTarget:'side',
                        width:600,
                        height:200
                    }
                ]
            }
        ];
        me.bbar = ['->', 
             {
             xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                var controller = Ext.create('CGP.partnerapplys.controller.Controller');
                window.controller = controller;
                if (me.form.isValid()) {
                    Ext.MessageBox.confirm(i18n.getKey('prompt'),i18n.getKey('refuseto'),callback);
                     function callback(id){
                     	if(id=='yes'){
                     	     var reason = me.form.getComponent('reason').getValue();
                             controller.rejectpartnerApplys(partnerId, reason,me);
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