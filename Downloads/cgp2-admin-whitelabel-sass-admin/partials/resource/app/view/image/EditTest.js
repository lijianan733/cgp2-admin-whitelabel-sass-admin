Ext.define('CGP.resource.view.image.EditTest', {
    extend: 'Ext.window.Window',
    alias : 'widget.edittest',
    title : 'Edit User',
    layout: 'fit',
    autoShow: true,
    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                items: [
                    {
                        xtype: 'textfield',
                        name : 'name',
                        fieldLabel: 'Name'
                    },
                    {
                        xtype: 'textfield',
                        name : 'format',
                        fieldLabel: 'format'
                    }
                ]
            }
        ];
        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];
        this.callParent(arguments);
    }
});