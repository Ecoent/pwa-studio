import React, { Fragment, useMemo } from 'react';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './breadcrumbs.css';
import { array, string } from 'prop-types';

const URL_SUFFIX = '.html';

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = path => {
    if (path) {
        return resourceUrl(`/${path}${URL_SUFFIX}`);
    }

    // If there is no path this is just a dead link.
    return '#';
};

/**
 * Breadcrumbs! Sorts and generates links for an array of breadcrumb data.
 * By default the current category is _not_ a link but will be if a path is
 * provided.
 *
 * @param {String} props.currentCategory name of the current category
 * @param {String} props.currentPath path to the current category
 * @param {Array} props.data An array of data containing category information
 * for each breadcrumb.
 */
const Breadcrumbs = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    // data can be `null` which won't default destructure.
    const data = props.data || [];
    const { currentCategory, currentPath } = props;

    const sortedData = useMemo(() => data.sort(sortCrumbs), [data]);

    const normalized = useMemo(
        () =>
            sortedData.map(category => ({
                text: category.category_name,
                path: getPath(category.category_url_path)
            })),
        [sortedData]
    );

    const divider = useMemo(() => <span className={classes.divider}>></span>, [
        classes.divider
    ]);

    // For all links generate a fragment like "/ Text"
    const links = useMemo(() => {
        return normalized.map(({ text, path }) => {
            return (
                <Fragment key={text}>
                    {divider}
                    <Link className={classes.link} to={path}>
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.link, divider, normalized]);

    const lastCategory = currentPath ? (
        <Link className={classes.link} to={getPath(currentPath)}>
            {currentCategory}
        </Link>
    ) : (
        <span className={classes.currentCategory}>{currentCategory}</span>
    );

    return (
        <div className={classes.root}>
            <Link className={classes.link} to="/">
                {'Home'}
            </Link>
            {links}
            {divider}
            {lastCategory}
        </div>
    );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
    currentCategory: string,
    currentPath: string,
    data: array
};
