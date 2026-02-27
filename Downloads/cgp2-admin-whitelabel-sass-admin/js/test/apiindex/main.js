Ext.onReady(function () {
    var header = Ext.create("Ext.panel.Panel", {
        //title: '头',
        header: false,
        height: 100,
        titleAlign: 'center',
        border: false,
        region: 'north'
    });
    var navigation = Ext.create("Ext.tree.Panel", {
        title: "菜单栏",
        width: 350,
        rootVisible: false,
        store: Ext.create("Ext.data.TreeStore", {
            fields: [
                {name: "title", type: "string"},
                {name: "url", type: "string"},
                {name: "leaf", type: "boolean"}
            ],
            proxy: {
                type: 'memory'
            },
            autoSync: true,
            root: {
                expanded: true,
                children: [
                    {title: "CGP后台管理系统", url: "http://localhost:3000/static/index.html", leaf: true},
                    {title: "whitelabel后台管理系统", url: "http://localhost:3000/static/whitelabel.html", leaf: true}
                ]
            }
        }),
        columns: [
            {
                xtype: 'treecolumn',
                text: '名称',
                flex: 3,
                dataIndex: 'title',
                //locked: true,
                renderer: function (value, metadata, record) {
                    return record.get("title");
                }
            }
        ],
        listeners: {
            itemclick: function (view, record) {
                Ext.getCmp("center").removeAll();
                Ext.getCmp("center").add({
                    layout: 'fit',
                    border: false,
                    html: '<iframe id="tabs_iframe_' + "mail_template" + '" ' +
                        'src="' + record.data.url + '" width="100%" height="100%"' +
                        ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                        '</iframe>',
                    closeable: true
                })
            }
        },
        region: 'west'
    });
    var center = Ext.create("Ext.panel.Panel", {
        title: 'api',
        layout: 'fit',
        id: "center",
        header: false,
        //border:false,
        region: 'center'
    });
    center.add({
        layout: 'fit',
        border: false,
        html: '<iframe id="tabs_iframe_' + "mail_template" + '" ' +
            'src="http://localhost:3000/static/index.html" width="100%" height="100%"' +
            ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
            '</iframe>',
        closeable: true
    });
    var page = Ext.create("Ext.container.Viewport", {
        layout: "border",
        items: [header, navigation, center]
    })
})