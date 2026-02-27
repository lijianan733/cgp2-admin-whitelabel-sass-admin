/**
 * Created by nan on 2020/12/18
 */
Ext.define('CGP.background.store.BackgroundSeriesStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'CGP.background.model.BackgroundSerieModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/backgroundSeries',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
})