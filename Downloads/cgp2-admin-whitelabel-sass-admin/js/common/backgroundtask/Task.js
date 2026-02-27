/**
 * @Description:后台任务组件中具体执行的任务类
 * @author nan
 * @date 2022/6/27

 buildTask: function (handler) {
            var url = adminPath + 'api/productSync?withSku=' + data.productSync.withSku;
            var jsonData = {
                comment: data.comment,
                targetEnv: targetEnv,
                productIds: data.productIds,
                userId: data.userId
            };
            JSAjaxRequest(url, 'POST', true, jsonData, false, function (require, success, response) {
                if (success) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        var syncProgressId = responseMessage.data;
                        var url = adminPath + 'api/productSyncProgresses/' + syncProgressId;
                        handler(syncProgressId, url);
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('同步产品失败'));
                }
            })
        },
 updateProgress: function (url, callback) {
            var me = this;
            var count = 0;
            var timer = setInterval(function () {
                JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                    ++count;
                    if (success) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        task.result = responseText.data;
                        callback(responseText.data, count, timer);
                    }
                });
            }, 1000);
        },
 callback: function (responseData, count, timer) {
            var me = this;
            me.status = responseData.status;
            me.rate = count * 0.1;
            if (me.status == 'success' || me.status == 'failure') {
                clearInterval(timer);
            }
            if (me.status != 'success') {
                if (me.rate >= 1) {
                    me.rate = 0.99;
                }
            } else {
                me.rate = 1;
            }
            me.fireEvent('statuschange', me, me.status, me);
        },

 */
Ext.define('CGP.common.backgroundtask.Task', {
        extend: 'Ext.Base',
        //混入监听功能
        mixins: {
            observable: 'Ext.util.Observable'
        },
        //任务的显示信息
        taskId: '',
        result: null,//任务的结果信息
        status: '',//任务状态，success failure waiting
        title: null,
        buildTask: null,//获取任务唯一标识的方法
        /**
         *  轮询任务进度的方法
         */
        updateProgress: Ext.emptyFn,
        /**
         * 任务需要执行的内容
         */
        processTask: function () {
            var me = this;
            me.updateProgress(me.callback.bind(me));
        },
        /**
         * 用户重写
         * 轮询后处理请求结果的方法
         */
        callback: function (responseData, count, timer) {
            var me = this;
            me.status = responseData.status;
            me.rate = count * 0.1;
            if (me.status == 'success' || me.status == 'failure') {
                clearInterval(timer);
            }
            if (me.status != 'success') {
                if (me.rate >= 1) {
                    me.rate = 0.99;
                }
            } else {
                me.rate = 1;
            }
            me.fireEvent('statuschange', me, me.status, me);
        },
        /**
         * 开始任务
         */
        start: function () {
            var me = this;
            me.status = 'waiting';
            new Promise((resolve, reject) => {
                me.buildTask(function (syncProgressId, url) {
                    resolve({syncProgressId, url});
                }.bind(me));
            }).then((res) => {
                me.updateProgress(res.url, function () {
                    me.callback(...arguments);
                });
            })
        },
        /**
         * 销毁任务
         */
        destroy: function () {

        },
        /**
         * 重新开始
         */
        redo: function () {
            var me = this;
            me.status = 'waiting';
            me.start();
        },
        constructor: function (config) {
            var me = this;
            Ext.apply(me, config);
            me.callParent(config);
            me.taskId = JSGetUUID();
            me.mixins.observable.constructor.call(me, config);
            me.addEvents(
                'statuschange',
            );
        }
    }
);