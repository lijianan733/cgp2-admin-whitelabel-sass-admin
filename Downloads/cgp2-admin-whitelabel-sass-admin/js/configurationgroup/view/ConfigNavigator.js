//Ext.syncRequire(['CGP.material.model.Material', 'CGP.material.override.Filter']);
Ext.define("CGP.configurationgroup.view.ConfigNavigator", {
    extend: "Ext.tree.Panel",
    region: 'west',
    width: 350,
    collapsible: true,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true
        }
    },
    autoScroll: true,
    children: null,
    itemId: 'configNavigator',
    selModel: {
        selType: 'rowmodel'
    },
    activePath: '',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('navigation');
        var store = Ext.data.StoreManager.lookup('configGroupStore');

        var refundUrl = path + 'partials/config/' + 'refundomtgrid' + '.html' + window.location.search;
        var serverTemplateUrl = path + 'partials/config/mailtemplate/' + 'managermailtpl' + '.html' + window.location.search;
        var userTemplateUrl = path + 'partials/config/mailtemplate/' + 'cusmailtpl' + '.html' + window.location.search;
        var invoiceTemplateUrl = path + 'partials/config/' + 'invoiceomtgrid' + '.html' + window.location.search;
        var ticketReceiverUrl = path + 'partials/config/' + 'ticket.html' + window.location.search;
        var userTemplateFileUrl = path + 'partials/config/mailtemplate/' + 'cusmailfile.html' + window.location.search;
        var managerTemplateFileUrl = path + 'partials/config/mailtemplate/' + 'managermailfile.html' + window.location.search;

        var mailTemplate = {
            id: -1,
            title: 'mailTemplate',
            description: 'mailTemplate',
            visible: true,
            icon: '../configgroup/icon/folder.png',
            leaf: false,
            children: [
                {
                    id: -11,
                    title: i18n.getKey('user') + i18n.getKey('notifyEmailConfig'),
                    description: 'User Order Mail Template',
                    visible: true,
                    icon: '../configgroup/icon/file.png',
                    url: userTemplateUrl,
                    leaf: true
                },
                {
                    id: -12,
                    title: i18n.getKey('server') + i18n.getKey('notifyEmailConfig'),
                    description: 'Service Order Mail Template',
                    url: serverTemplateUrl,
                    icon: '../configgroup/icon/file.png',
                    visible: true,
                    leaf: true
                },
                {
                    id: -13,
                    title: 'Refund Mail Template',
                    description: 'Refund Mail Template',
                    visible: true,
                    icon: '../configgroup/icon/file.png',
                    url: refundUrl,
                    leaf: true
                },
                {
                    id: -14,
                    title: 'Invoice Mail Template',
                    url: invoiceTemplateUrl,
                    description: 'Invoice Mail Template',
                    visible: true,
                    icon: '../configgroup/icon/file.png',
                    leaf: true
                },
                {
                    id: -15,
                    title: 'ticketReceiver',
                    url: ticketReceiverUrl,
                    description: 'ticketReceiver',
                    visible: true,
                    icon: '../configgroup/icon/file.png',
                    leaf: true
                }/*,旧的功能
                 {
                 id: -16,
                 title: 'customerMailTemplateFile',
                 url: userTemplateFileUrl,
                 description: 'customerMailTemplateFile',
                 visible: true,
                 icon: '../configgroup/icon/file.png',
                 leaf: true
                 },
                 {
                 id: -17,
                 title: 'managerMailTemplateFile',
                 url: managerTemplateFileUrl,
                 description: 'managerMailTemplateFile',
                 visible: true,
                 icon: '../configgroup/icon/file.png',
                 leaf: true
                 }*/
            ]
        };

        var registerMailUrl = path + 'partials/config/' + '3.html';
        var customerMailUrl = path + 'partials/config/' + '7.html';
        var orderMailUrl = path + 'partials/config/' + '8.html';
        var sendMailCfg = {
            id: -2,
            title: 'sendMailCfg',
            description: 'sendMailCfg',
            visible: true,
            icon: '../configgroup/icon/folder.png',
            leaf: false,
            children: [
                {
                    id: -21,
                    title: 'register mail',
                    url: registerMailUrl,
                    icon: '../configgroup/icon/file.png',
                    description: 'register mail',
                    visible: true,
                    leaf: true
                },
                {
                    id: -22,
                    title: "customer mail",
                    url: customerMailUrl,
                    icon: '../configgroup/icon/file.png',
                    description: "customer mail",
                    visible: true,
                    leaf: true
                },
                {
                    id: -23,
                    title: 'order mail',
                    url: orderMailUrl,
                    description: 'order mail',
                    visible: true,
                    icon: '../configgroup/icon/file.png',
                    leaf: true
                }
            ]
        };

        var configTreeStore = Ext.create('CGP.configurationgroup.store.ConfigurationTree', {
            root: {
                expanded: true,
                children: []
            }
        });
        var websiteStore = Ext.data.StoreManager.lookup('websiteStore');
        var filterGroupIds = [2, 3, 6, 7, 8, 12, 13, 14, 15, 18, 19, 20, 21, 22, 24, 25];
        store.load({
            async: false,
            callback: function (records, options, success) {
                var rootChild = [mailTemplate, sendMailCfg];
                Ext.each(records, function (record) {
                    if (!Ext.Array.contains(filterGroupIds, record.getId())) {
                        var url = path + 'partials/config/' + record.getId() + '.html';
                        var children = record.data;
                        children.url = url;
                        children.leaf = true;
                        children.icon = '../configgroup/icon/file.png';
                        rootChild.push(children);
                        /*root.children.push(record.data)*/
                    }
                })
                //添加viewconfig导航项
                var url = path + 'partials/config/' + 'viewconfig.html';
                var viewConfig = {};
                viewConfig.url = url;
                viewConfig.description = 'Website setting';
                viewConfig.id = 99;
                viewConfig.title = 'viewConfig'
                viewConfig.leaf = true;
                viewConfig.icon = '../configgroup/icon/file.png';
                rootChild.push(viewConfig);

                //添加qp收货管理导航项
                url = path + 'partials/config/' + 'manageqpdeliveryaddress.html';
                viewConfig = {};
                viewConfig.url = url;
                viewConfig.description = 'Website setting';
                viewConfig.id = 100;
                viewConfig.title = i18n.getKey('qp收货地址管理')
                viewConfig.leaf = true;
                viewConfig.icon = '../configgroup/icon/file.png';
                rootChild.push(viewConfig);

                //添加管理网站对应产品的供应商
                url = path + 'partials/config/' + 'productdefaultsupplier.html';
                viewConfig = {};
                viewConfig.url = url;
                viewConfig.description = 'Website setting';
                viewConfig.id = 101;
                viewConfig.title = i18n.getKey('产品默认供应商配置管理')
                viewConfig.leaf = true;
                viewConfig.icon = '../configgroup/icon/file.png';
                rootChild.push(viewConfig);


                configTreeStore.setRootNode({
                    expanded: true,
                    id: 0,
                    children: rootChild
                })
            }
        });
        me.store = configTreeStore;
        me.tbar = [
            {
                xtype: 'combo',
                labelWidth: 50,
                displayField: 'name',
                valueField: 'id',
                fieldLabel: '网站',
                itemId: 'website',
                editable: false,
                store: websiteStore,
                listeners: {
                    'change': function (field, newValue, oldValue) {
                        if (!Ext.isEmpty(me.activePath)) {
                            me.getSelectionModel().deselectAll();
                            me.selectPath(me.activePath);
                        }
                    },
                    afterrender: function (combo) {
                        var store = combo.getStore();
                        store.on('load', function () {
                            combo.select(store.getById(11));
                        });
                    }
                }
            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 3,
                dataIndex: 'title',
                renderer: function (value) {
                    return i18n.getKey(value);
                }
            }/*,
             {
             text: i18n.getKey('type'),
             flex: 1,
             dataIndex: 'type',
             renderer: function (value) {
             var type;
             if (value == 'MaterialSpu') {
             type = '<div style="color: green">' + i18n.getKey(value) + '</div>'
             } else if (value == 'MaterialType') {
             type = '<div style="color: blue">' + i18n.getKey(value) + '</div>'
             }
             return type;
             }

             }*/
        ];
        me.listeners = {
            select: function (rowModel, record) {
                me.activePath = record.getPath();
                var infoTab = rowModel.view.ownerCt.ownerCt.getComponent('configCenterPanel');
                var websiteId = me.down('toolbar').getComponent('website').getValue();
                var websiteCode = null;
                websiteStore.each(function (record) {
                    if (record.get('id') == websiteId) {
                        websiteCode = record.get('code');
                    }
                });
                var url = record.get('url') + '?website=' + websiteCode + '&websiteId=' + websiteId;
                if (record.isLeaf()) {
                    infoTab.removeAll();
                    infoTab.add({
                        layout: 'fit',
                        id: record.get('title'),
                        html: '<iframe id="tabs_iframe_' + "mail_template" + '" ' +
                            'src="' + url + '" width="100%" height="100%"' +
                            ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                            '</iframe>',
                        closeable: true
                    });
                }
            }
        };
        me.callParent(arguments);

    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
});
