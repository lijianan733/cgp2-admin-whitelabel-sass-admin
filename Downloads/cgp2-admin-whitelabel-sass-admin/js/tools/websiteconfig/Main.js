/**
 * @Description: 初始化项目的配置，只能放在配置文件中，其他可变的配置的在这里
 * @author nan
 * @date 2023/2/16
 */
Ext.Loader.syncRequire([
    'CGP.tools.websiteconfig.view.Grid',
    'CGP.tools.websiteconfig.config.Config'
])
Ext.onReady(function () {
    var website = CGP.tools.websiteconfig.config.Config.website;
    var arr = website.map(function (item) {
        return {
            website: item.value
        }
    });
    var view = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'tabpanel',
                items: [
                    {
                        xtype: 'tabpanel',
                        title: 'stage',
                        defaults: {
                            xtype: 'websiteconfiggrid',
                            status: 'stage'

                        },
                        items: arr,
                        listeners: {
                            tabchange: function (tab, newPanel, oldPanel) {
                                newPanel.grid.store.load();
                            }
                        }
                    },
                    {
                        xtype: 'tabpanel',
                        title: 'release',
                        hidden: JSWebsiteIsTest(),
                        defaults: {
                            xtype: 'websiteconfiggrid',
                            status: 'release'
                        },
                        items: Ext.clone(arr),
                        listeners: {
                            tabchange: function (tab, newPanel, oldPanel) {
                                newPanel.grid.store.load();
                            }
                        }
                    }
                ],
                listeners: {
                    tabchange: function (tab, newPanel, oldPanel) {
                        tab.activeTab.activeTab.grid.store.load();
                    }
                }
            }
        ]
    });
})