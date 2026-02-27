/**
 * @author xiu
 * @date 2023/9/21
 * 思路
 * 1.在iframe渲染后 调用initPage(type,materialViews) //type 请求类型,materialViews 请求数据
 *   发送一次初始化(bootstrap)请求
 *
 * 2.在接收到iframe执行完成的状态时qp.builder.production.afterViewChanged 才允许继续向iframe发送请求
 *
 * 3.对页面操作时 调用 loadPage(type,single)
 *   会获取到整个页面的信息 通过传入的标识符(single)
 *   判断当前做的是什么操作 并将数据过滤出来单独发送
 *   发送一次变更(update)/刷新(change)请求
 */
Ext.Loader.syncRequire([
    'CGP.builderrandomcardpage.view.MainPage',
    'CGP.builderrandomcardpage.defaults.MainPageDefault'
])
Ext.onReady(function () {
    var defaults = Ext.create('CGP.builderrandomcardpage.defaults.MainPageDefault'),
        isDeliverInfo = JSGetQueryString('isDeliverInfo'),
        // manufacturePreview = JSGetQueryString('manufacturePreview'),
        manufacturePreview = '/whitelabel-site/h5builder/production/preview/pc/5/index.html',
        {config, test9} = defaults,
        defaultsConfig = config,
        {
            id,
            seqNo,
            orderId,
            statusId,
            orderNumber,
            productInstanceId,
        } = defaultsConfig,
        materialDataUrl = adminPath + `api/productInstances/${productInstanceId}/material/materialViews/v2`,
        materialData = JSGetQuery(materialDataUrl),
        fixMaterialData = materialData.filter(item => {
            var designMethod = item['designMethod'];

            return designMethod === 'FIX'
        }),
        isEnableFixPage = !!fixMaterialData.length,
        fixPage = path + 'partials/builderpage/main.html' +
            '?id=' + id +
            '&seqNo=' + seqNo +
            '&status=' + statusId +
            '&orderId=' + orderId +
            '&orderNumber=' + orderNumber +
            '&productInstanceId=' + productInstanceId +
            '&isDeliverInfo=' + isDeliverInfo +
            '&isRandomCardPage=' + true +
            '&manufacturePreview=' + manufacturePreview;

    Ext.create('Ext.Viewport', {
        layout: 'fit',
        itemId: 'view',
        items: [
            {
                xtype: 'tabpanel',
                items: [
                    {
                        xtype: 'mainPage',
                        itemId: 'random',
                        title: i18n.getKey('随机卡图库'),
                        defaultsConfig: defaultsConfig
                    },
                    {
                        xtype: 'panel',
                        itemId: 'fix',
                        autoScroll: true,
                        disabled: !isEnableFixPage,
                        title: i18n.getKey('固定定制'),
                        html: '<iframe id="tabs_iframe_' + JSGetUUID() + '" src="' + fixPage + '" width="100%" height="100%" frameBorder="0" ' + 'onactivate="Ext.menu.MenuMgr.hideAll();">' + '</iframe>',
                    },
                ]
            }
        ]
    })
});
