/**
 * @Description:
 * @author nan
 * @date 2022/11/3
 */
Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.view.PageGenerateDetailPanel',
    'CGP.common.typesettingschedule.view.ImpressionGenerateDetailPanel',
    'CGP.common.typesettingschedule.view.DistributeGenerateDetailPanel'
])
Ext.onReady(function () {
    var orderItemId = JSGetQueryString('orderItemId'),
        jobConfigId = JSGetQueryString('jobConfigId'),
        type = JSGetQueryString('type'),
        jobTaskId = JSGetQueryString('jobTaskId'),
        pageConfigId = JSGetQueryString('pageConfigId'),
        time = JSGetQueryString('time'),
        component = null;

    if (type == '0') {
        component = {
            xtype: 'pagegeneratedetailpanel',
            title: 'pageTask执行详情' + `&nbsp&nbsp&nbsp&nbsp&nbsp` + '执行时间: ' + time,
            hidden: type != '0',
            pageConfigId: pageConfigId,
            orderItemId: orderItemId,
            jobConfigId: jobConfigId,
            jobTaskId: jobTaskId,
            time: time
        };
    } else if (type == '1') {
        component = {
            xtype: 'impressiongeneratedetailpanel',
            title: '大版详情' + `&nbsp&nbsp&nbsp&nbsp&nbsp` + '执行时间: ' + time,
            hidden: type != '1',
            jobTaskId: jobTaskId,
            time: time
        };
    } else if (type == '2') {
        component = {
            xtype: 'distributegeneratedetailpanel',
            title: '分发详情' + `&nbsp&nbsp&nbsp&nbsp&nbsp` + '执行时间: ' + time,
            hidden: type != '2',
            jobTaskId: jobTaskId,
            time: time
        }
    }
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [component]
    });

})