// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useEffect, useState } from "react";
import { modelInputProps } from "../helpers/Interfaces";
import AppContext from "./createContext";
import helper from '../helpers/helper'

const AppContextProvider = (props: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) => {
  const [clicks, setClicks] = useState<Array<modelInputProps> | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [maskImg, setMaskImg] = useState<HTMLImageElement | null>(null);
  const [apply, setApply] = useState<boolean>(false);

  useEffect(() => {
    console.log("Init Website");
    let current_user_id = helper.get_user_identification()
    if (!current_user_id) {
      helper.set_user_identification()
    }

  }, [])

  return (
    <AppContext.Provider
      value={{
        clicks: [clicks, setClicks],
        image: [image, setImage],
        maskImg: [maskImg, setMaskImg],
        apply: [apply, setApply],
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
