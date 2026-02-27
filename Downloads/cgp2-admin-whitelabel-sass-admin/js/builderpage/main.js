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
    'CGP.builderpage.view.MainPage'
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'mainPage',
            },
        ]
    })
});
