/**
 * @Description:
 * @author nan
 * @date 2022/6/27
 */
Ext.define('CGP.common.backgroundtask.model.BackgroundTaskModel', {
    extend: 'Ext.data.Model',
    idProperty: 'taskId',
    fields: [
        {
            name: 'taskId',
            type: 'string'
        },
        {
            name: 'task',
            type: 'object'
        },
        {
            name: 'status',
            type: 'string'//success failure process
        },
        {
            name: 'title',
            type: 'string'//任务标题
        },
        {
            name: 'rate',
            type: 'int'//完成比例
        },
        {
            name: 'count',
            type: 'int'//该批处理的总数量
        },
        /**
         *    taskDetail: {
         *                         rate: 0.50,//0~1
         *                         requireType: 'multi',
         *                         errorInfo:{}
         *                     }
         */
        {
            name: 'taskDetail',
            type: 'object'
        },
        {
            name: 'idArray',
            type: 'array'//请求id数组
        },
        {
            name: 'deleteSrc',
            type: 'string',
            defaultValue: path + 'ClientLibs/extjs/resources/themes/images/ux/delete_disable.png'
        },
        {
            name: 'redoSrc',
            type: 'string',
            defaultValue: path + 'ClientLibs/extjs/resources/themes/images/ux/redo_disable.png'
        },
        {
            name: 'errorSrc',
            type: 'string',
            defaultValue: path + 'ClientLibs/extjs/resources/themes/images/ux/error.png'
        },
        {
            name: 'index',
            type: 'number',
        }
    ]
});