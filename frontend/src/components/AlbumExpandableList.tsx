import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ExpandableGroup from './ExpandableGroup';
import CheckboxListSelector from './CheckboxListSelector'; // Import your existing CheckboxListSelector component
import { UndecidedGroup } from '../types';
import { TedTaggerDispatch } from '../models';
import { getDisplayedUndecidedGroups } from '../selectors';

export interface AlbumExpandableListPropsFromParent {
  groupedUndecidedGroups: Record<string, UndecidedGroup[]>
  onUndecidedGroupToggle: (selectedItems: UndecidedGroup[]) => void;
  onDeleteUndecidedGroup: (undecidedGroup: UndecidedGroup) => void;
}

export interface AlbumExpandableListProps extends AlbumExpandableListPropsFromParent {
  displayedUndecidedGroups: UndecidedGroup[];
}

const AlbumExpandableList = (props: AlbumExpandableListProps) => {

  const renderExpandableGroup = (undecidedGroupNamePrefix: string, undecidedGroupsInAlbum: UndecidedGroup[]): JSX.Element => {
    return (
      <ExpandableGroup key={undecidedGroupNamePrefix} label={undecidedGroupNamePrefix}>
        <CheckboxListSelector
          label={`Select groups in ${undecidedGroupNamePrefix}`}
          items={undecidedGroupsInAlbum}
          selectedItems={props.displayedUndecidedGroups ?? []}
          showSelectAll={false}
          showDeleteItem={true}
          getItemLabel={(undecidedGroup: UndecidedGroup) => undecidedGroup.name}
          onChange={props.onUndecidedGroupToggle}
          // onDeleteItem={(item: UndecidedGroup) => console.log('onDeleteItem', item)}
          onDeleteItem={props.onDeleteUndecidedGroup}
        />
      </ExpandableGroup>
    )
  }

  const renderExpandableGroups = (): JSX.Element[] => {
    const expandableGroups: JSX.Element[] = [];
    for (const undecidedGroupNamePrefix in props.groupedUndecidedGroups) {
      if (props.groupedUndecidedGroups[undecidedGroupNamePrefix]) {
        const undecidedGroupsInAlbum: UndecidedGroup[] = props.groupedUndecidedGroups[undecidedGroupNamePrefix];
        const expandableGroup = renderExpandableGroup(undecidedGroupNamePrefix, undecidedGroupsInAlbum);
        expandableGroups.push(expandableGroup);
      }
    }
    return expandableGroups;
  };

  const expandableGroups = renderExpandableGroups();

  return (
    <div>
      {expandableGroups}
    </div>
  );
};

function mapStateToProps(state: any): any {
  return {
    displayedUndecidedGroups: getDisplayedUndecidedGroups(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumExpandableList) as React.FC<any>;
