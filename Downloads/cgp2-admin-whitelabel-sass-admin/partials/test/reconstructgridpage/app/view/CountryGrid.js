Ext.define('CGP.testreconstructgridpage.view.CountryGrid',{
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.testgridpage',
    i18nblock: i18n.getKey('partner'),
    block: 'partner',
    //editPage: 'edit.html',
    /*config: {
     gridCfg: {
     store: Ext.create('CGP.partner.store.PartnerStore'),
     columns: [
     {
     text: i18n.getKey('id'),
     dataIndex: 'id',
     width: 80
     }
     ]
     },
     filterCfg: {
     items: [
     {
     name: 'id',
     xtype: 'numberfield',
     fieldLabel: i18n.getKey('id'),
     hideTrigger: true,
     itemId: 'id'
     }
     ]
     }
     },*/

    initComponent: function(){
        var me = this;
        /*me.config = {
         gridCfg: {
         store: Ext.create('CGP.partner.store.PartnerStore'),
         columns: [
         {
         text: i18n.getKey('id'),
         dataIndex: 'id',
         width: 80
         }
         ]
         },
         filterCfg: {
         items: [
         {
         name: 'id',
         xtype: 'numberfield',
         fieldLabel: i18n.getKey('id'),
         hideTrigger: true,
         itemId: 'id'
         }
         ]
         }
         };*/
        me.config.gridCfg = {
            store: Ext.create('CGP.testreconstructgridpage.store.PartnerStore'),
            editAction:false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 80
                }
            ]
        };
        me.config.filterCfg = {
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    hideTrigger: true,
                    itemId: 'id'
                }
            ]
        };

        me.callParent();
    }

});