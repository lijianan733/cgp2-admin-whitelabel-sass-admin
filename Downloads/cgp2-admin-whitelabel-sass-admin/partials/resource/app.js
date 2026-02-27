Ext.application({
    requires: 'Ext.container.Viewport',
    name: 'CGP.resource',
    appFolder: 'app',
    controllers: [
        'Image'
    ],
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    id:'resourceTab',
                    xtype:'tabpanel',
                    itemId:'resourceTab',
                    items:[
                        {
                            id: 'imageSRC',
                            title: i18n.getKey('image'),
                            origin: window.location.href,
                            html: '<iframe id="tabs_iframe_imageSRC" src="' + path+'partials/resource/app/view/image/main.html' + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                            // closable: true
                        },
                        {
                            id: 'fontSRC',
                            title: i18n.getKey('font'),
                            origin: window.location.href,
                            html: '<iframe id="tabs_iframe_fontSRC" src="' + path+'partials/resource/app/view/font/main.html' + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                            // closable: true
                        },
                        {
                            id: 'colorSRC',
                            title: i18n.getKey('color'),
                            origin: window.location.href,
                            html: '<iframe id="tabs_iframe_colorSRC" src="' + path+'partials/resource/app/view/color/main.html' + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                            // closable: true
                        },
                        // {
                        //     id: 'ornamentSRC',
                        //     title: i18n.getKey('ornament'),
                        //     origin: window.location.href,
                        //     html: '<iframe id="tabs_iframe_ornamentSRC" src="' + path+'partials/resource/app/view/ornament/main.html' + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                        //     // closable: true
                        // },
                        {
                            id: 'dynamicSizeImageSRC',
                            title: i18n.getKey('dynamicSizeImage'),
                            origin: window.location.href,
                            html: '<iframe id="tabs_iframe_dynamicSizeImageSRC" src="' + path+'partials/resource/app/view/dynamicSizeImage/main.html' + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                            // closable: true
                        },
                        {
                            id: 'compositeDisplayObjectSRC',
                            title: i18n.getKey('compositeDisplayObject'),
                            origin: window.location.href,
                            html: '<iframe id="tabs_iframe_compositeDisplayObjectSRC" src="' + path+'partials/resource/app/view/compositeDisplayObject/main.html' + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                            // closable: true
                        }

                    ]
                }
            ]
        });
        // Ext.create('CGP.resource.view.image.Main', {
        //     id:'imageMain'
        // });
    }
});