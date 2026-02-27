/**
 * @Description:发布操作的日志，记录所以发布操作信息
 * @author nan
 * @date 2022/4/28
 */
Ext.syncRequire([
    'CGP.cmslog.view.CMSLogDetail',
]);
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {layout: 'fit'});
    var panel = Ext.create('CGP.cmslog.view.CMSLogDetail');
    page.add(panel);
});