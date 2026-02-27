/**
 * Created by admin on 2021/3/30.
 */
Ext.define("CGP.tools.links.MainPage", {
    extend: "Ext.panel.Panel",
    region: 'center',
    header: false,
    defaults: {
        padding: '10 60 10 60',
    },
    id: 'links',
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
        var locationHref = location.origin;
        if (location.pathname.indexOf('stage') > 0) {
            locationHref = locationHref + '/stage';
        }
        me.itemId = 'links';
        me.title = i18n.getKey("links");
        me.items = [
            {
                xtype: 'displayfield',
                value: '<a href="' + cgp2ComposingPath + 'swagger-ui.html#/" id="composingServer" style="color: blue" target="_blank">' + i18n.getKey("排版服务API") + '</a>',

            },
            {
                xtype: 'displayfield',
                value: '<a href="' + jobServerPath + 'swagger-ui.html#/" id="jobServer" style="color: blue" target="_blank">' + i18n.getKey("job服务API") + '</a>',

            },
            {
                xtype: 'displayfield',
                value: '<a href="' + pageServerPath + 'swagger-ui.html#/" id="pageServer" style="color: blue" target="_blank">' + i18n.getKey("page服务API") + '</a>',

            },
            {
                xtype: 'displayfield',
                value: '<a href="' + impressionServerPath + 'swagger-ui.html#/" id="impressionServer" style="color: blue" target="_blank">' + i18n.getKey("大版服务API") + '</a>',

            },
            {
                xtype: 'displayfield',
                value: '<a href="' + distributeServerPath + 'swagger-ui.html#/" id="distributeServer" style="color: blue" target="_blank">' + i18n.getKey("分发服务API") + '</a>',
            },
          /*  {
                xtype: 'displayfield',
                value: '<a href="' + qpEcommerceV2 + 'swagger-ui.html#/" id="distributeServer" style="color: blue" target="_blank">' + i18n.getKey("qp_ecommerce_v2网站API") + '</a>',
            },*/
            {
                xtype: 'displayfield',
                value: '<a href="' + locationHref + '/cgp-rest/swagger-ui.html#/" id="CGPSwagger" style="color: blue" target="_blank">' + i18n.getKey("CGP后台API") + '</a>',
            },
            {
                xtype: 'displayfield',
                value: '<a href="' + locationHref + '/product-library/index.html" id="产品库系统后台" style="color: blue" target="_blank">' + i18n.getKey("产品库系统") + '</a>',
            },
            {
                xtype: 'displayfield',
                value: '<a href="' + locationHref + '/qpson-admin/index.html" id="qpson-admin" style="color: blue" target="_blank">' + i18n.getKey("QPSON Whitelabel网站") + '</a>',
            },
            {
                xtype: 'displayfield',
                value: '<a href="' + locationHref + '/manufacture-synergic-center/index.html" id="qpson-admin" style="color: blue" target="_blank">' + i18n.getKey("生产协同中心") + '</a>',
            },
            {
                xtype: 'displayfield',
                value: '<a href="' + locationHref + '/qp_ecommerce/index.html" id="qpson-admin" style="color: blue" target="_blank">' + i18n.getKey("qp电商统一管理后台") + '</a>',
            },
            {
                xtype: 'displayfield',
                value: '<a href="' + locationHref + '/qp-finance-data-admin/index.html" id="qpson-admin" style="color: blue" target="_blank">' + i18n.getKey("qp财务数据系统") + '</a>',
            },

        ];
        me.callParent(arguments);

    }

});
