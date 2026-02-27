/**
 * Created by nan on 2020/11/13
 */
Ext.Loader.syncRequire([
    'CGP.buildercommonresource.view.FontGrid',
    'CGP.buildercommonresource.view.FontLanguageNavigate'
])
Ext.define('CGP.buildercommonresource.view.FontPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fontpanel',
    layout: {
        type: 'fit'
    },
    items: [
        {
            xtype: 'fontgrid',
        }
       /* {
            xtype: 'fontlanguagenavigate',
            region: 'west',
            split: true,
            itemId: 'westPanel',
            title: i18n.getKey('language')
        }, {
            xtype: 'panel',
            region: 'center',
            itemId: 'centerPanel',
            layout: 'fit',
            items: [
                {
                    xtype: 'fontgrid',
                    hidden: true,
                }
            ]
        }*/
    ]
})