Ext.onReady(function () {
    // 国际化资源

    // 初始化国际化资源


    //点击跳转到另一个页面
    onDivClick = function (param) {
        url = path + 'partials/configgroup/configgroup.html?websiteId=' + param;
        JSOpen({
            id: param,
            title: i18n.getKey('configgroup'),
            url: url
        });
    }

    tpl = new Ext.Template(
        '<a href="#" onclick="onDivClick({param})"  style="text-decoration: none;color: blue">{config}</div>'
    );

    // website 的管理页面
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('website'),
        block: 'website',
        editPage: 'edit.html',
        tbarCfg: {
            disabledButtons: ['delete','config']
        },
        // gridPage 的列配置
        gridCfg: {
            // 取同目录下的 store文件中的store
            store: Ext.StoreManager.lookup('websiteStore'),
            frame: false,

            deleteAction: false,//是否启用delete的按钮
            columns: [{
                text: i18n.getKey('operation'),
                itemId: 'websiteconfig',
                sortable: true,
                dataIndex: 'id',
                width: '8%',
                renderer: function (value) {
                    //return "<a href= 'javascript:onDivClick();'>config</div>";
                    var oo = tpl.apply({
                        param: "'" + value + "'",
                        config: i18n.getKey('config')
                    });
                    return oo;
                }
            }, {
                text: i18n.getKey('id'),
                dataIndex: 'id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true,
                width: '10%'
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                itemId: 'name',
                sortable: true,
                width: '20%'
            }, {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                xtype: 'gridcolumn',
                itemId: 'code',
                sortable: true,
                width: '10%'
            }, {
                text: i18n.getKey('url'),
                dataIndex: 'url',
                itemId: 'url',
                xtype: 'gridcolumn',
                sortable: true,
                width: '20%',
                flex: 1
            }]
        },
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }]
        }

    });

});
