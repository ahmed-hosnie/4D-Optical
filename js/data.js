const IMAGE_PATH_MAP = {
  "bluelight1.jpg": "folder_1_80_images/bluelight1.jpg",
  "bluelight1_3d_0.jpg": "folder_1_80_images/bluelight1_3d_0.jpg",
  "bluelight1_3d_1.jpg": "folder_1_80_images/bluelight1_3d_1.jpg",
  "bluelight1_3d_2.jpg": "folder_1_80_images/bluelight1_3d_2.jpg",
  "bluelight1_3d_3.jpg": "folder_1_80_images/bluelight1_3d_3.jpg",
  "bluelight1_3d_4.jpg": "folder_1_80_images/bluelight1_3d_4.jpg",
  "bluelight1_bundle.jpg": "folder_1_80_images/bluelight1_bundle.jpg",
  "bluelight1_front.jpg": "folder_1_80_images/bluelight1_front.jpg",
  "bluelight1_macro.jpg": "folder_1_80_images/bluelight1_macro.jpg",
  "bluelight1_tilt.jpg": "folder_1_80_images/bluelight1_tilt.jpg",
  "cat2_bundle.jpg": "folder_1_80_images/cat2_bundle.jpg",
  "cateye1.jpg": "folder_1_80_images/cateye1.jpg",
  "cateye1_3d_0.jpg": "folder_1_80_images/cateye1_3d_0.jpg",
  "cateye1_3d_1.jpg": "folder_1_80_images/cateye1_3d_1.jpg",
  "cateye1_3d_2.jpg": "folder_1_80_images/cateye1_3d_2.jpg",
  "cateye1_3d_3.jpg": "folder_1_80_images/cateye1_3d_3.jpg",
  "cateye1_3d_4.jpg": "folder_1_80_images/cateye1_3d_4.jpg",
  "cateye1_bundle.jpg": "folder_1_80_images/cateye1_bundle.jpg",
  "cateye1_front.jpg": "folder_1_80_images/cateye1_front.jpg",
  "cateye1_macro.jpg": "folder_1_80_images/cateye1_macro.jpg",
  "cateye1_tilt.jpg": "folder_1_80_images/cateye1_tilt.jpg",
  "clubmaster.jpg": "folder_1_80_images/clubmaster.jpg",
  "clubmaster_3d_0.jpg": "folder_1_80_images/clubmaster_3d_0.jpg",
  "clubmaster_3d_1.jpg": "folder_1_80_images/clubmaster_3d_1.jpg",
  "clubmaster_3d_2.jpg": "folder_1_80_images/clubmaster_3d_2.jpg",
  "clubmaster_3d_3.jpg": "folder_1_80_images/clubmaster_3d_3.jpg",
  "clubmaster_3d_4.jpg": "folder_1_80_images/clubmaster_3d_4.jpg",
  "clubmaster_bundle.jpg": "folder_1_80_images/clubmaster_bundle.jpg",
  "clubmaster_front.jpg": "folder_1_80_images/clubmaster_front.jpg",
  "clubmaster_macro.jpg": "folder_1_80_images/clubmaster_macro.jpg",
  "clubmaster_tilt.jpg": "folder_1_80_images/clubmaster_tilt.jpg",
  "cutout_aviator_sunglasses.jpg": "folder_1_80_images/cutout_aviator_sunglasses.jpg",
  "cutout_titanium_round.jpg": "folder_1_80_images/cutout_titanium_round.jpg",
  "hero.jpg": "folder_1_80_images/hero.jpg",
  "kids1_bundle.jpg": "folder_1_80_images/kids1_bundle.jpg",
  "kids2_bundle.jpg": "folder_1_80_images/kids2_bundle.jpg",
  "kids_optical.jpg": "folder_1_80_images/kids_optical.jpg",
  "kids_optical_2.jpg": "folder_1_80_images/kids_optical_2.jpg",
  "kids_optical_2_3d_0.jpg": "folder_1_80_images/kids_optical_2_3d_0.jpg",
  "kids_optical_2_3d_1.jpg": "folder_1_80_images/kids_optical_2_3d_1.jpg",
  "kids_optical_2_3d_2.jpg": "folder_1_80_images/kids_optical_2_3d_2.jpg",
  "kids_optical_2_3d_3.jpg": "folder_1_80_images/kids_optical_2_3d_3.jpg",
  "kids_optical_2_3d_4.jpg": "folder_1_80_images/kids_optical_2_3d_4.jpg",
  "kids_optical_2_bundle.jpg": "folder_1_80_images/kids_optical_2_bundle.jpg",
  "kids_optical_2_front.jpg": "folder_1_80_images/kids_optical_2_front.jpg",
  "kids_optical_2_macro.jpg": "folder_1_80_images/kids_optical_2_macro.jpg",
  "kids_optical_2_tilt.jpg": "folder_1_80_images/kids_optical_2_tilt.jpg",
  "kids_optical_3d_0.jpg": "folder_1_80_images/kids_optical_3d_0.jpg",
  "kids_optical_3d_1.jpg": "folder_1_80_images/kids_optical_3d_1.jpg",
  "kids_optical_3d_2.jpg": "folder_1_80_images/kids_optical_3d_2.jpg",
  "kids_optical_3d_3.jpg": "folder_1_80_images/kids_optical_3d_3.jpg",
  "kids_optical_3d_4.jpg": "folder_1_80_images/kids_optical_3d_4.jpg",
  "kids_optical_bundle.jpg": "folder_1_80_images/kids_optical_bundle.jpg",
  "kids_optical_front.jpg": "folder_1_80_images/kids_optical_front.jpg",
  "kids_optical_macro.jpg": "folder_1_80_images/kids_optical_macro.jpg",
  "kids_optical_tilt.jpg": "folder_1_80_images/kids_optical_tilt.jpg",
  "kids_sunglasses.jpg": "folder_1_80_images/kids_sunglasses.jpg",
  "kids_sunglasses_3d_0.jpg": "folder_1_80_images/kids_sunglasses_3d_0.jpg",
  "kids_sunglasses_3d_1.jpg": "folder_1_80_images/kids_sunglasses_3d_1.jpg",
  "kids_sunglasses_3d_2.jpg": "folder_1_80_images/kids_sunglasses_3d_2.jpg",
  "kids_sunglasses_3d_3.jpg": "folder_1_80_images/kids_sunglasses_3d_3.jpg",
  "kids_sunglasses_3d_4.jpg": "folder_1_80_images/kids_sunglasses_3d_4.jpg",
  "kids_sunglasses_bundle.jpg": "folder_1_80_images/kids_sunglasses_bundle.jpg",
  "kids_sunglasses_front.jpg": "folder_1_80_images/kids_sunglasses_front.jpg",
  "kids_sunglasses_macro.jpg": "folder_1_80_images/kids_sunglasses_macro.jpg",
  "kids_sunglasses_tilt.jpg": "folder_1_80_images/kids_sunglasses_tilt.jpg",
  "lens_blue.jpg": "folder_1_80_images/lens_blue.jpg",
  "lens_gray.jpg": "folder_1_80_images/lens_gray.jpg",
  "lens_green.jpg": "folder_1_80_images/lens_green.jpg",
  "lens_hazel.jpg": "folder_1_80_images/lens_hazel.jpg",
  "lens_honey.jpg": "folder_1_80_images/lens_honey.jpg",
  "lens_turquoise.jpg": "folder_1_80_images/lens_turquoise.jpg",
  "optical1.jpg": "folder_1_80_images/optical1.jpg",
  "optical1_3d_0.jpg": "folder_1_80_images/optical1_3d_0.jpg",
  "optical1_3d_1.jpg": "folder_1_80_images/optical1_3d_1.jpg",
  "optical1_3d_2.jpg": "folder_1_80_images/optical1_3d_2.jpg",
  "optical1_3d_3.jpg": "folder_1_80_images/optical1_3d_3.jpg",
  "optical1_3d_4.jpg": "folder_1_80_images/optical1_3d_4.jpg",
  "optical1_bundle.jpg": "folder_1_80_images/optical1_bundle.jpg",
  "optical1_front.jpg": "folder_1_80_images/optical1_front.jpg",
  "optical1_macro.jpg": "folder_2_80_images/optical1_macro.jpg",
  "optical1_tilt.jpg": "folder_2_80_images/optical1_tilt.jpg",
  "optical_aviator_black_bundle.jpg": "folder_2_80_images/optical_aviator_black_bundle.jpg",
  "optical_aviator_gold.jpg": "folder_2_80_images/optical_aviator_gold.jpg",
  "optical_aviator_gold_3d_0.jpg": "folder_2_80_images/optical_aviator_gold_3d_0.jpg",
  "optical_aviator_gold_3d_1.jpg": "folder_2_80_images/optical_aviator_gold_3d_1.jpg",
  "optical_aviator_gold_3d_2.jpg": "folder_2_80_images/optical_aviator_gold_3d_2.jpg",
  "optical_aviator_gold_3d_3.jpg": "folder_2_80_images/optical_aviator_gold_3d_3.jpg",
  "optical_aviator_gold_3d_4.jpg": "folder_2_80_images/optical_aviator_gold_3d_4.jpg",
  "optical_aviator_gold_bundle.jpg": "folder_2_80_images/optical_aviator_gold_bundle.jpg",
  "optical_aviator_gold_front.jpg": "folder_2_80_images/optical_aviator_gold_front.jpg",
  "optical_aviator_gold_macro.jpg": "folder_2_80_images/optical_aviator_gold_macro.jpg",
  "optical_aviator_gold_tilt.jpg": "folder_2_80_images/optical_aviator_gold_tilt.jpg",
  "optical_black_thick_bundle.jpg": "folder_2_80_images/optical_black_thick_bundle.jpg",
  "optical_butterfly_rosegold_bundle.jpg": "folder_2_80_images/optical_butterfly_rosegold_bundle.jpg",
  "optical_cateye_blackgold.jpg": "folder_2_80_images/optical_cateye_blackgold.jpg",
  "optical_cateye_blackgold_3d_0.jpg": "folder_2_80_images/optical_cateye_blackgold_3d_0.jpg",
  "optical_cateye_blackgold_3d_1.jpg": "folder_2_80_images/optical_cateye_blackgold_3d_1.jpg",
  "optical_cateye_blackgold_3d_2.jpg": "folder_2_80_images/optical_cateye_blackgold_3d_2.jpg",
  "optical_cateye_blackgold_3d_3.jpg": "folder_2_80_images/optical_cateye_blackgold_3d_3.jpg",
  "optical_cateye_blackgold_3d_4.jpg": "folder_2_80_images/optical_cateye_blackgold_3d_4.jpg",
  "optical_cateye_blackgold_bundle.jpg": "folder_2_80_images/optical_cateye_blackgold_bundle.jpg",
  "optical_cateye_blackgold_front.jpg": "folder_2_80_images/optical_cateye_blackgold_front.jpg",
  "optical_cateye_blackgold_macro.jpg": "folder_2_80_images/optical_cateye_blackgold_macro.jpg",
  "optical_cateye_blackgold_tilt.jpg": "folder_2_80_images/optical_cateye_blackgold_tilt.jpg",
  "optical_clear_crystal_bundle.jpg": "folder_2_80_images/optical_clear_crystal_bundle.jpg",
  "optical_clubmaster_black_bundle.jpg": "folder_2_80_images/optical_clubmaster_black_bundle.jpg",
  "optical_clubmaster_havana.jpg": "folder_2_80_images/optical_clubmaster_havana.jpg",
  "optical_clubmaster_havana_3d_0.jpg": "folder_2_80_images/optical_clubmaster_havana_3d_0.jpg",
  "optical_clubmaster_havana_3d_1.jpg": "folder_2_80_images/optical_clubmaster_havana_3d_1.jpg",
  "optical_clubmaster_havana_3d_2.jpg": "folder_2_80_images/optical_clubmaster_havana_3d_2.jpg",
  "optical_clubmaster_havana_3d_3.jpg": "folder_2_80_images/optical_clubmaster_havana_3d_3.jpg",
  "optical_clubmaster_havana_3d_4.jpg": "folder_2_80_images/optical_clubmaster_havana_3d_4.jpg",
  "optical_clubmaster_havana_bundle.jpg": "folder_2_80_images/optical_clubmaster_havana_bundle.jpg",
  "optical_clubmaster_havana_front.jpg": "folder_2_80_images/optical_clubmaster_havana_front.jpg",
  "optical_clubmaster_havana_macro.jpg": "folder_2_80_images/optical_clubmaster_havana_macro.jpg",
  "optical_clubmaster_havana_tilt.jpg": "folder_2_80_images/optical_clubmaster_havana_tilt.jpg",
  "optical_smoky_gray.jpg": "folder_2_80_images/optical_smoky_gray.jpg",
  "optical_smoky_gray_3d_0.jpg": "folder_2_80_images/optical_smoky_gray_3d_0.jpg",
  "optical_smoky_gray_3d_1.jpg": "folder_2_80_images/optical_smoky_gray_3d_1.jpg",
  "optical_smoky_gray_3d_2.jpg": "folder_2_80_images/optical_smoky_gray_3d_2.jpg",
  "optical_smoky_gray_3d_3.jpg": "folder_2_80_images/optical_smoky_gray_3d_3.jpg",
  "optical_smoky_gray_3d_4.jpg": "folder_2_80_images/optical_smoky_gray_3d_4.jpg",
  "optical_smoky_gray_bundle.jpg": "folder_2_80_images/optical_smoky_gray_bundle.jpg",
  "optical_smoky_gray_front.jpg": "folder_2_80_images/optical_smoky_gray_front.jpg",
  "optical_smoky_gray_macro.jpg": "folder_2_80_images/optical_smoky_gray_macro.jpg",
  "optical_smoky_gray_tilt.jpg": "folder_2_80_images/optical_smoky_gray_tilt.jpg",
  "optical_women.jpg": "folder_2_80_images/optical_women.jpg",
  "optical_women_3d_0.jpg": "folder_2_80_images/optical_women_3d_0.jpg",
  "optical_women_3d_1.jpg": "folder_2_80_images/optical_women_3d_1.jpg",
  "optical_women_3d_2.jpg": "folder_2_80_images/optical_women_3d_2.jpg",
  "optical_women_3d_3.jpg": "folder_2_80_images/optical_women_3d_3.jpg",
  "optical_women_3d_4.jpg": "folder_2_80_images/optical_women_3d_4.jpg",
  "optical_women_bundle.jpg": "folder_2_80_images/optical_women_bundle.jpg",
  "optical_women_front.jpg": "folder_2_80_images/optical_women_front.jpg",
  "optical_women_macro.jpg": "folder_2_80_images/optical_women_macro.jpg",
  "optical_women_tilt.jpg": "folder_2_80_images/optical_women_tilt.jpg",
  "real_amber_thick_bundle.jpg": "folder_2_80_images/real_amber_thick_bundle.jpg",
  "real_black_aviator.jpg": "folder_2_80_images/real_black_aviator.jpg",
  "real_black_aviator_3d_0.jpg": "folder_2_80_images/real_black_aviator_3d_0.jpg",
  "real_black_aviator_3d_1.jpg": "folder_2_80_images/real_black_aviator_3d_1.jpg",
  "real_black_aviator_3d_2.jpg": "folder_2_80_images/real_black_aviator_3d_2.jpg",
  "real_black_aviator_3d_3.jpg": "folder_2_80_images/real_black_aviator_3d_3.jpg",
  "real_black_aviator_3d_4.jpg": "folder_2_80_images/real_black_aviator_3d_4.jpg",
  "real_black_aviator_bundle.jpg": "folder_2_80_images/real_black_aviator_bundle.jpg",
  "real_black_aviator_front.jpg": "folder_2_80_images/real_black_aviator_front.jpg",
  "real_black_aviator_macro.jpg": "folder_2_80_images/real_black_aviator_macro.jpg",
  "real_black_aviator_tilt.jpg": "folder_2_80_images/real_black_aviator_tilt.jpg",
  "real_black_silver_bundle.jpg": "folder_2_80_images/real_black_silver_bundle.jpg",
  "real_butterfly_rosegold_bundle.jpg": "folder_2_80_images/real_butterfly_rosegold_bundle.jpg",
  "real_cateye_gold_bundle.jpg": "folder_2_80_images/real_cateye_gold_bundle.jpg",
  "real_champagne_crystal.jpg": "folder_2_80_images/real_champagne_crystal.jpg",
  "real_champagne_crystal_3d_0.jpg": "folder_2_80_images/real_champagne_crystal_3d_0.jpg",
  "real_champagne_crystal_3d_1.jpg": "folder_2_80_images/real_champagne_crystal_3d_1.jpg",
  "real_champagne_crystal_3d_2.jpg": "folder_2_80_images/real_champagne_crystal_3d_2.jpg",
  "real_champagne_crystal_3d_3.jpg": "folder_2_80_images/real_champagne_crystal_3d_3.jpg",
  "real_champagne_crystal_3d_4.jpg": "folder_2_80_images/real_champagne_crystal_3d_4.jpg",
  "real_champagne_crystal_bundle.jpg": "folder_2_80_images/real_champagne_crystal_bundle.jpg",
  "real_champagne_crystal_front.jpg": "folder_2_80_images/real_champagne_crystal_front.jpg",
  "real_champagne_crystal_macro.jpg": "folder_2_80_images/real_champagne_crystal_macro.jpg",
  "real_champagne_crystal_tilt.jpg": "folder_3_80_images/real_champagne_crystal_tilt.jpg",
  "real_clear_acetate_bundle.jpg": "folder_3_80_images/real_clear_acetate_bundle.jpg",
  "real_clear_black_halfrim_bundle.jpg": "folder_3_80_images/real_clear_black_halfrim_bundle.jpg",
  "real_clipon_round_clear.jpg": "folder_3_80_images/real_clipon_round_clear.jpg",
  "real_clipon_round_clear_3d_0.jpg": "folder_3_80_images/real_clipon_round_clear_3d_0.jpg",
  "real_clipon_round_clear_3d_1.jpg": "folder_3_80_images/real_clipon_round_clear_3d_1.jpg",
  "real_clipon_round_clear_3d_2.jpg": "folder_3_80_images/real_clipon_round_clear_3d_2.jpg",
  "real_clipon_round_clear_3d_3.jpg": "folder_3_80_images/real_clipon_round_clear_3d_3.jpg",
  "real_clipon_round_clear_3d_4.jpg": "folder_3_80_images/real_clipon_round_clear_3d_4.jpg",
  "real_clipon_round_clear_bundle.jpg": "folder_3_80_images/real_clipon_round_clear_bundle.jpg",
  "real_clipon_round_clear_front.jpg": "folder_3_80_images/real_clipon_round_clear_front.jpg",
  "real_clipon_round_clear_macro.jpg": "folder_3_80_images/real_clipon_round_clear_macro.jpg",
  "real_clipon_round_clear_tilt.jpg": "folder_3_80_images/real_clipon_round_clear_tilt.jpg",
  "real_clipon_square_clear.jpg": "folder_3_80_images/real_clipon_square_clear.jpg",
  "real_clipon_square_clear_3d_0.jpg": "folder_3_80_images/real_clipon_square_clear_3d_0.jpg",
  "real_clipon_square_clear_3d_1.jpg": "folder_3_80_images/real_clipon_square_clear_3d_1.jpg",
  "real_clipon_square_clear_3d_2.jpg": "folder_3_80_images/real_clipon_square_clear_3d_2.jpg",
  "real_clipon_square_clear_3d_3.jpg": "folder_3_80_images/real_clipon_square_clear_3d_3.jpg",
  "real_clipon_square_clear_3d_4.jpg": "folder_3_80_images/real_clipon_square_clear_3d_4.jpg",
  "real_clipon_square_clear_bundle.jpg": "folder_3_80_images/real_clipon_square_clear_bundle.jpg",
  "real_clipon_square_clear_front.jpg": "folder_3_80_images/real_clipon_square_clear_front.jpg",
  "real_clipon_square_clear_macro.jpg": "folder_3_80_images/real_clipon_square_clear_macro.jpg",
  "real_clipon_square_clear_tilt.jpg": "folder_3_80_images/real_clipon_square_clear_tilt.jpg",
  "real_clipon_tortoise.jpg": "folder_3_80_images/real_clipon_tortoise.jpg",
  "real_clipon_tortoise_3d_0.jpg": "folder_3_80_images/real_clipon_tortoise_3d_0.jpg",
  "real_clipon_tortoise_3d_1.jpg": "folder_3_80_images/real_clipon_tortoise_3d_1.jpg",
  "real_clipon_tortoise_3d_2.jpg": "folder_3_80_images/real_clipon_tortoise_3d_2.jpg",
  "real_clipon_tortoise_3d_3.jpg": "folder_3_80_images/real_clipon_tortoise_3d_3.jpg",
  "real_clipon_tortoise_3d_4.jpg": "folder_3_80_images/real_clipon_tortoise_3d_4.jpg",
  "real_clipon_tortoise_bundle.jpg": "folder_3_80_images/real_clipon_tortoise_bundle.jpg",
  "real_clipon_tortoise_front.jpg": "folder_3_80_images/real_clipon_tortoise_front.jpg",
  "real_clipon_tortoise_macro.jpg": "folder_3_80_images/real_clipon_tortoise_macro.jpg",
  "real_clipon_tortoise_tilt.jpg": "folder_3_80_images/real_clipon_tortoise_tilt.jpg",
  "real_clubmaster_black_bundle.jpg": "folder_3_80_images/real_clubmaster_black_bundle.jpg",
  "real_emerald_acetate.jpg": "folder_3_80_images/real_emerald_acetate.jpg",
  "real_emerald_acetate_3d_0.jpg": "folder_3_80_images/real_emerald_acetate_3d_0.jpg",
  "real_emerald_acetate_3d_1.jpg": "folder_3_80_images/real_emerald_acetate_3d_1.jpg",
  "real_emerald_acetate_3d_2.jpg": "folder_3_80_images/real_emerald_acetate_3d_2.jpg",
  "real_emerald_acetate_3d_3.jpg": "folder_3_80_images/real_emerald_acetate_3d_3.jpg",
  "real_emerald_acetate_3d_4.jpg": "folder_3_80_images/real_emerald_acetate_3d_4.jpg",
  "real_emerald_acetate_bundle.jpg": "folder_3_80_images/real_emerald_acetate_bundle.jpg",
  "real_emerald_acetate_front.jpg": "folder_3_80_images/real_emerald_acetate_front.jpg",
  "real_emerald_acetate_macro.jpg": "folder_3_80_images/real_emerald_acetate_macro.jpg",
  "real_emerald_acetate_tilt.jpg": "folder_3_80_images/real_emerald_acetate_tilt.jpg",
  "real_grey_crystal_bundle.jpg": "folder_3_80_images/real_grey_crystal_bundle.jpg",
  "real_honey_acetate_bundle.jpg": "folder_3_80_images/real_honey_acetate_bundle.jpg",
  "real_kids_blue_orange_bundle.jpg": "folder_3_80_images/real_kids_blue_orange_bundle.jpg",
  "real_kids_round_blue_bundle.jpg": "folder_3_80_images/real_kids_round_blue_bundle.jpg",
  "real_kids_sun_blue_bundle.jpg": "folder_3_80_images/real_kids_sun_blue_bundle.jpg",
  "real_navy_half.jpg": "folder_3_80_images/real_navy_half.jpg",
  "real_navy_half_3d_0.jpg": "folder_3_80_images/real_navy_half_3d_0.jpg",
  "real_navy_half_3d_1.jpg": "folder_3_80_images/real_navy_half_3d_1.jpg",
  "real_navy_half_3d_2.jpg": "folder_3_80_images/real_navy_half_3d_2.jpg",
  "real_navy_half_3d_3.jpg": "folder_3_80_images/real_navy_half_3d_3.jpg",
  "real_navy_half_3d_4.jpg": "folder_3_80_images/real_navy_half_3d_4.jpg",
  "real_navy_half_bundle.jpg": "folder_3_80_images/real_navy_half_bundle.jpg",
  "real_navy_half_front.jpg": "folder_3_80_images/real_navy_half_front.jpg",
  "real_navy_half_macro.jpg": "folder_3_80_images/real_navy_half_macro.jpg",
  "real_navy_half_tilt.jpg": "folder_3_80_images/real_navy_half_tilt.jpg",
  "real_pilot_dark.jpg": "folder_3_80_images/real_pilot_dark.jpg",
  "real_pilot_dark_3d_0.jpg": "folder_3_80_images/real_pilot_dark_3d_0.jpg",
  "real_pilot_dark_3d_1.jpg": "folder_3_80_images/real_pilot_dark_3d_1.jpg",
  "real_pilot_dark_3d_2.jpg": "folder_3_80_images/real_pilot_dark_3d_2.jpg",
  "real_pilot_dark_3d_3.jpg": "folder_3_80_images/real_pilot_dark_3d_3.jpg",
  "real_pilot_dark_3d_4.jpg": "folder_3_80_images/real_pilot_dark_3d_4.jpg",
  "real_pilot_dark_bundle.jpg": "folder_3_80_images/real_pilot_dark_bundle.jpg",
  "real_pilot_dark_front.jpg": "folder_3_80_images/real_pilot_dark_front.jpg",
  "real_pilot_dark_macro.jpg": "folder_3_80_images/real_pilot_dark_macro.jpg",
  "real_pilot_dark_tilt.jpg": "folder_3_80_images/real_pilot_dark_tilt.jpg",
  "real_pilot_gray_bundle.jpg": "folder_3_80_images/real_pilot_gray_bundle.jpg",
  "real_pilot_striped.jpg": "folder_3_80_images/real_pilot_striped.jpg",
  "real_pilot_striped_3d_0.jpg": "folder_3_80_images/real_pilot_striped_3d_0.jpg",
  "real_pilot_striped_3d_1.jpg": "folder_3_80_images/real_pilot_striped_3d_1.jpg",
  "real_pilot_striped_3d_2.jpg": "folder_3_80_images/real_pilot_striped_3d_2.jpg",
  "real_pilot_striped_3d_3.jpg": "folder_3_80_images/real_pilot_striped_3d_3.jpg",
  "real_pilot_striped_3d_4.jpg": "folder_3_80_images/real_pilot_striped_3d_4.jpg",
  "real_pilot_striped_bundle.jpg": "folder_3_80_images/real_pilot_striped_bundle.jpg",
  "real_pilot_striped_front.jpg": "folder_3_80_images/real_pilot_striped_front.jpg",
  "real_pilot_striped_macro.jpg": "folder_3_80_images/real_pilot_striped_macro.jpg",
  "real_pilot_striped_tilt.jpg": "folder_3_80_images/real_pilot_striped_tilt.jpg",
  "real_retro_twotone.jpg": "folder_4_80_images/real_retro_twotone.jpg",
  "real_retro_twotone_3d_0.jpg": "folder_4_80_images/real_retro_twotone_3d_0.jpg",
  "real_retro_twotone_3d_1.jpg": "folder_4_80_images/real_retro_twotone_3d_1.jpg",
  "real_retro_twotone_3d_2.jpg": "folder_4_80_images/real_retro_twotone_3d_2.jpg",
  "real_retro_twotone_3d_3.jpg": "folder_4_80_images/real_retro_twotone_3d_3.jpg",
  "real_retro_twotone_3d_4.jpg": "folder_4_80_images/real_retro_twotone_3d_4.jpg",
  "real_retro_twotone_bundle.jpg": "folder_4_80_images/real_retro_twotone_bundle.jpg",
  "real_retro_twotone_front.jpg": "folder_4_80_images/real_retro_twotone_front.jpg",
  "real_retro_twotone_macro.jpg": "folder_4_80_images/real_retro_twotone_macro.jpg",
  "real_retro_twotone_tilt.jpg": "folder_4_80_images/real_retro_twotone_tilt.jpg",
  "real_square_thick_black.jpg": "folder_4_80_images/real_square_thick_black.jpg",
  "real_square_thick_black_3d_0.jpg": "folder_4_80_images/real_square_thick_black_3d_0.jpg",
  "real_square_thick_black_3d_1.jpg": "folder_4_80_images/real_square_thick_black_3d_1.jpg",
  "real_square_thick_black_3d_2.jpg": "folder_4_80_images/real_square_thick_black_3d_2.jpg",
  "real_square_thick_black_3d_3.jpg": "folder_4_80_images/real_square_thick_black_3d_3.jpg",
  "real_square_thick_black_3d_4.jpg": "folder_4_80_images/real_square_thick_black_3d_4.jpg",
  "real_square_thick_black_bundle.jpg": "folder_4_80_images/real_square_thick_black_bundle.jpg",
  "real_square_thick_black_front.jpg": "folder_4_80_images/real_square_thick_black_front.jpg",
  "real_square_thick_black_macro.jpg": "folder_4_80_images/real_square_thick_black_macro.jpg",
  "real_square_thick_black_tilt.jpg": "folder_4_80_images/real_square_thick_black_tilt.jpg",
  "real_striped_green.jpg": "folder_4_80_images/real_striped_green.jpg",
  "real_striped_green_3d_0.jpg": "folder_4_80_images/real_striped_green_3d_0.jpg",
  "real_striped_green_3d_1.jpg": "folder_4_80_images/real_striped_green_3d_1.jpg",
  "real_striped_green_3d_2.jpg": "folder_4_80_images/real_striped_green_3d_2.jpg",
  "real_striped_green_3d_3.jpg": "folder_4_80_images/real_striped_green_3d_3.jpg",
  "real_striped_green_3d_4.jpg": "folder_4_80_images/real_striped_green_3d_4.jpg",
  "real_striped_green_bundle.jpg": "folder_4_80_images/real_striped_green_bundle.jpg",
  "real_striped_green_front.jpg": "folder_4_80_images/real_striped_green_front.jpg",
  "real_striped_green_macro.jpg": "folder_4_80_images/real_striped_green_macro.jpg",
  "real_striped_green_tilt.jpg": "folder_4_80_images/real_striped_green_tilt.jpg",
  "real_titanium_blue.jpg": "folder_4_80_images/real_titanium_blue.jpg",
  "real_titanium_blue_3d_0.jpg": "folder_4_80_images/real_titanium_blue_3d_0.jpg",
  "real_titanium_blue_3d_1.jpg": "folder_4_80_images/real_titanium_blue_3d_1.jpg",
  "real_titanium_blue_3d_2.jpg": "folder_4_80_images/real_titanium_blue_3d_2.jpg",
  "real_titanium_blue_3d_3.jpg": "folder_4_80_images/real_titanium_blue_3d_3.jpg",
  "real_titanium_blue_3d_4.jpg": "folder_4_80_images/real_titanium_blue_3d_4.jpg",
  "real_titanium_blue_bundle.jpg": "folder_4_80_images/real_titanium_blue_bundle.jpg",
  "real_titanium_blue_front.jpg": "folder_4_80_images/real_titanium_blue_front.jpg",
  "real_titanium_blue_macro.jpg": "folder_4_80_images/real_titanium_blue_macro.jpg",
  "real_titanium_blue_tilt.jpg": "folder_4_80_images/real_titanium_blue_tilt.jpg",
  "real_turquoise_acetate_bundle.jpg": "folder_4_80_images/real_turquoise_acetate_bundle.jpg",
  "real_turquoise_cat.jpg": "folder_4_80_images/real_turquoise_cat.jpg",
  "real_turquoise_cat_3d_0.jpg": "folder_4_80_images/real_turquoise_cat_3d_0.jpg",
  "real_turquoise_cat_3d_1.jpg": "folder_4_80_images/real_turquoise_cat_3d_1.jpg",
  "real_turquoise_cat_3d_2.jpg": "folder_4_80_images/real_turquoise_cat_3d_2.jpg",
  "real_turquoise_cat_3d_3.jpg": "folder_4_80_images/real_turquoise_cat_3d_3.jpg",
  "real_turquoise_cat_3d_4.jpg": "folder_4_80_images/real_turquoise_cat_3d_4.jpg",
  "real_turquoise_cat_bundle.jpg": "folder_4_80_images/real_turquoise_cat_bundle.jpg",
  "real_turquoise_cat_front.jpg": "folder_4_80_images/real_turquoise_cat_front.jpg",
  "real_turquoise_cat_macro.jpg": "folder_4_80_images/real_turquoise_cat_macro.jpg",
  "real_turquoise_cat_tilt.jpg": "folder_4_80_images/real_turquoise_cat_tilt.jpg",
  "real_veil_cat.jpg": "folder_4_80_images/real_veil_cat.jpg",
  "real_veil_cat_3d_0.jpg": "folder_4_80_images/real_veil_cat_3d_0.jpg",
  "real_veil_cat_3d_1.jpg": "folder_4_80_images/real_veil_cat_3d_1.jpg",
  "real_veil_cat_3d_2.jpg": "folder_4_80_images/real_veil_cat_3d_2.jpg",
  "real_veil_cat_3d_3.jpg": "folder_4_80_images/real_veil_cat_3d_3.jpg",
  "real_veil_cat_3d_4.jpg": "folder_4_80_images/real_veil_cat_3d_4.jpg",
  "real_veil_cat_bundle.jpg": "folder_4_80_images/real_veil_cat_bundle.jpg",
  "real_veil_cat_front.jpg": "folder_4_80_images/real_veil_cat_front.jpg",
  "real_veil_cat_macro.jpg": "folder_4_80_images/real_veil_cat_macro.jpg",
  "real_veil_cat_tilt.jpg": "folder_4_80_images/real_veil_cat_tilt.jpg",
  "real_women_geometric_cat.jpg": "folder_4_80_images/real_women_geometric_cat.jpg",
  "real_women_geometric_cat_3d_0.jpg": "folder_4_80_images/real_women_geometric_cat_3d_0.jpg",
  "real_women_geometric_cat_3d_1.jpg": "folder_4_80_images/real_women_geometric_cat_3d_1.jpg",
  "real_women_geometric_cat_3d_2.jpg": "folder_4_80_images/real_women_geometric_cat_3d_2.jpg",
  "real_women_geometric_cat_3d_3.jpg": "folder_4_80_images/real_women_geometric_cat_3d_3.jpg",
  "real_women_geometric_cat_3d_4.jpg": "folder_4_80_images/real_women_geometric_cat_3d_4.jpg",
  "real_women_geometric_cat_bundle.jpg": "folder_4_80_images/real_women_geometric_cat_bundle.jpg",
  "real_women_geometric_cat_front.jpg": "folder_4_80_images/real_women_geometric_cat_front.jpg",
  "real_women_geometric_cat_macro.jpg": "folder_4_80_images/real_women_geometric_cat_macro.jpg",
  "real_women_geometric_cat_tilt.jpg": "folder_4_80_images/real_women_geometric_cat_tilt.jpg",
  "real_women_square_amber.jpg": "folder_4_80_images/real_women_square_amber.jpg",
  "real_women_square_amber_3d_0.jpg": "folder_4_80_images/real_women_square_amber_3d_0.jpg",
  "real_women_square_amber_3d_1.jpg": "folder_4_80_images/real_women_square_amber_3d_1.jpg",
  "real_women_square_amber_3d_2.jpg": "folder_4_80_images/real_women_square_amber_3d_2.jpg",
  "real_women_square_amber_3d_3.jpg": "folder_4_80_images/real_women_square_amber_3d_3.jpg",
  "real_women_square_amber_3d_4.jpg": "folder_4_80_images/real_women_square_amber_3d_4.jpg",
  "real_women_square_amber_bundle.jpg": "folder_4_80_images/real_women_square_amber_bundle.jpg",
  "real_women_square_amber_front.jpg": "folder_4_80_images/real_women_square_amber_front.jpg",
  "real_women_square_amber_macro.jpg": "folder_4_80_images/real_women_square_amber_macro.jpg",
  "real_women_square_amber_tilt.jpg": "folder_5_64_images/real_women_square_amber_tilt.jpg",
  "real_women_square_pink.jpg": "folder_5_64_images/real_women_square_pink.jpg",
  "real_women_square_pink_3d_0.jpg": "folder_5_64_images/real_women_square_pink_3d_0.jpg",
  "real_women_square_pink_3d_1.jpg": "folder_5_64_images/real_women_square_pink_3d_1.jpg",
  "real_women_square_pink_3d_2.jpg": "folder_5_64_images/real_women_square_pink_3d_2.jpg",
  "real_women_square_pink_3d_3.jpg": "folder_5_64_images/real_women_square_pink_3d_3.jpg",
  "real_women_square_pink_3d_4.jpg": "folder_5_64_images/real_women_square_pink_3d_4.jpg",
  "real_women_square_pink_bundle.jpg": "folder_5_64_images/real_women_square_pink_bundle.jpg",
  "real_women_square_pink_front.jpg": "folder_5_64_images/real_women_square_pink_front.jpg",
  "real_women_square_pink_macro.jpg": "folder_5_64_images/real_women_square_pink_macro.jpg",
  "real_women_square_pink_tilt.jpg": "folder_5_64_images/real_women_square_pink_tilt.jpg",
  "square1.jpg": "folder_5_64_images/square1.jpg",
  "square1_3d_0.jpg": "folder_5_64_images/square1_3d_0.jpg",
  "square1_3d_1.jpg": "folder_5_64_images/square1_3d_1.jpg",
  "square1_3d_2.jpg": "folder_5_64_images/square1_3d_2.jpg",
  "square1_3d_3.jpg": "folder_5_64_images/square1_3d_3.jpg",
  "square1_3d_4.jpg": "folder_5_64_images/square1_3d_4.jpg",
  "square1_bundle.jpg": "folder_5_64_images/square1_bundle.jpg",
  "square1_front.jpg": "folder_5_64_images/square1_front.jpg",
  "square1_macro.jpg": "folder_5_64_images/square1_macro.jpg",
  "square1_tilt.jpg": "folder_5_64_images/square1_tilt.jpg",
  "sun1_bundle.jpg": "folder_5_64_images/sun1_bundle.jpg",
  "sunglasses1.jpg": "folder_5_64_images/sunglasses1.jpg",
  "sunglasses1_3d_0.jpg": "folder_5_64_images/sunglasses1_3d_0.jpg",
  "sunglasses1_3d_1.jpg": "folder_5_64_images/sunglasses1_3d_1.jpg",
  "sunglasses1_3d_2.jpg": "folder_5_64_images/sunglasses1_3d_2.jpg",
  "sunglasses1_3d_3.jpg": "folder_5_64_images/sunglasses1_3d_3.jpg",
  "sunglasses1_3d_4.jpg": "folder_5_64_images/sunglasses1_3d_4.jpg",
  "sunglasses1_bundle.jpg": "folder_5_64_images/sunglasses1_bundle.jpg",
  "sunglasses1_front.jpg": "folder_5_64_images/sunglasses1_front.jpg",
  "sunglasses1_macro.jpg": "folder_5_64_images/sunglasses1_macro.jpg",
  "sunglasses1_tilt.jpg": "folder_5_64_images/sunglasses1_tilt.jpg",
  "sunglasses_carbon_pilot.jpg": "folder_5_64_images/sunglasses_carbon_pilot.jpg",
  "sunglasses_carbon_pilot_3d_0.jpg": "folder_5_64_images/sunglasses_carbon_pilot_3d_0.jpg",
  "sunglasses_carbon_pilot_3d_1.jpg": "folder_5_64_images/sunglasses_carbon_pilot_3d_1.jpg",
  "sunglasses_carbon_pilot_3d_2.jpg": "folder_5_64_images/sunglasses_carbon_pilot_3d_2.jpg",
  "sunglasses_carbon_pilot_3d_3.jpg": "folder_5_64_images/sunglasses_carbon_pilot_3d_3.jpg",
  "sunglasses_carbon_pilot_3d_4.jpg": "folder_5_64_images/sunglasses_carbon_pilot_3d_4.jpg",
  "sunglasses_carbon_pilot_bundle.jpg": "folder_5_64_images/sunglasses_carbon_pilot_bundle.jpg",
  "sunglasses_carbon_pilot_front.jpg": "folder_5_64_images/sunglasses_carbon_pilot_front.jpg",
  "sunglasses_carbon_pilot_macro.jpg": "folder_5_64_images/sunglasses_carbon_pilot_macro.jpg",
  "sunglasses_carbon_pilot_tilt.jpg": "folder_5_64_images/sunglasses_carbon_pilot_tilt.jpg",
  "sunglasses_oversized_honey.jpg": "folder_5_64_images/sunglasses_oversized_honey.jpg",
  "sunglasses_oversized_honey_3d_0.jpg": "folder_5_64_images/sunglasses_oversized_honey_3d_0.jpg",
  "sunglasses_oversized_honey_3d_1.jpg": "folder_5_64_images/sunglasses_oversized_honey_3d_1.jpg",
  "sunglasses_oversized_honey_3d_2.jpg": "folder_5_64_images/sunglasses_oversized_honey_3d_2.jpg",
  "sunglasses_oversized_honey_3d_3.jpg": "folder_5_64_images/sunglasses_oversized_honey_3d_3.jpg",
  "sunglasses_oversized_honey_3d_4.jpg": "folder_5_64_images/sunglasses_oversized_honey_3d_4.jpg",
  "sunglasses_oversized_honey_bundle.jpg": "folder_5_64_images/sunglasses_oversized_honey_bundle.jpg",
  "sunglasses_oversized_honey_front.jpg": "folder_5_64_images/sunglasses_oversized_honey_front.jpg",
  "sunglasses_oversized_honey_macro.jpg": "folder_5_64_images/sunglasses_oversized_honey_macro.jpg",
  "sunglasses_oversized_honey_tilt.jpg": "folder_5_64_images/sunglasses_oversized_honey_tilt.jpg",
  "sunglasses_women.jpg": "folder_5_64_images/sunglasses_women.jpg",
  "sunglasses_women_3d_0.jpg": "folder_5_64_images/sunglasses_women_3d_0.jpg",
  "sunglasses_women_3d_1.jpg": "folder_5_64_images/sunglasses_women_3d_1.jpg",
  "sunglasses_women_3d_2.jpg": "folder_5_64_images/sunglasses_women_3d_2.jpg",
  "sunglasses_women_3d_3.jpg": "folder_5_64_images/sunglasses_women_3d_3.jpg",
  "sunglasses_women_3d_4.jpg": "folder_5_64_images/sunglasses_women_3d_4.jpg",
  "sunglasses_women_bundle.jpg": "folder_5_64_images/sunglasses_women_bundle.jpg",
  "sunglasses_women_front.jpg": "folder_5_64_images/sunglasses_women_front.jpg",
  "sunglasses_women_macro.jpg": "folder_5_64_images/sunglasses_women_macro.jpg",
  "sunglasses_women_tilt.jpg": "folder_5_64_images/sunglasses_women_tilt.jpg",
  "sun_carbon_aviator_bundle.jpg": "folder_5_64_images/sun_carbon_aviator_bundle.jpg",
  "sun_clubmaster_bundle.jpg": "folder_5_64_images/sun_clubmaster_bundle.jpg"
};

function resolveImagePath(rawPath) {
  if (!rawPath) return "";
  const cleanName = rawPath.replace(/^.*[\\/]/, "");
  return IMAGE_PATH_MAP[cleanName] || rawPath;
}

/**
 * 4D Optical - Pure Transparent Snapchat AR Glasses Cutouts (Zero Background)
 */

function svgToDataUri(svgStr) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
}

// 1. Titanium Round Frame (Front View Cutout)
const CUTOUT_ROUND_GOLD = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220" width="600" height="220">
  <defs>
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#92400E"/>
    </linearGradient>
  </defs>
  <!-- Temples -->
  <path d="M 40 85 L 5 80" stroke="url(#goldRim)" stroke-width="10" stroke-linecap="round"/>
  <path d="M 560 85 L 595 80" stroke="url(#goldRim)" stroke-width="10" stroke-linecap="round"/>
  <!-- Lenses -->
  <circle cx="160" cy="110" r="90" fill="rgba(255,255,255,0.12)" stroke="url(#goldRim)" stroke-width="14"/>
  <circle cx="440" cy="110" r="90" fill="rgba(255,255,255,0.12)" stroke="url(#goldRim)" stroke-width="14"/>
  <!-- Bridge -->
  <path d="M 250 95 C 270 80, 330 80, 350 95" fill="none" stroke="url(#goldRim)" stroke-width="14" stroke-linecap="round"/>
  <!-- Glare -->
  <path d="M 110 70 Q 160 45 190 85" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round"/>
  <path d="M 390 70 Q 440 45 470 85" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round"/>
</svg>
`);

// 2. Executive Square Black Frame (Front View Cutout)
const CUTOUT_SQUARE_BLACK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220" width="600" height="220">
  <defs>
    <linearGradient id="darkMat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <!-- Temples -->
  <path d="M 35 75 L 5 70" stroke="url(#darkMat)" stroke-width="12" stroke-linecap="round"/>
  <path d="M 565 75 L 595 70" stroke="url(#darkMat)" stroke-width="12" stroke-linecap="round"/>
  <!-- Lenses -->
  <rect x="60" y="30" width="200" height="150" rx="30" ry="30" fill="rgba(59,130,246,0.08)" stroke="url(#darkMat)" stroke-width="18"/>
  <rect x="340" y="30" width="200" height="150" rx="30" ry="30" fill="rgba(59,130,246,0.08)" stroke="url(#darkMat)" stroke-width="18"/>
  <!-- Bridge -->
  <path d="M 260 70 L 340 70" stroke="url(#darkMat)" stroke-width="18" stroke-linecap="round"/>
  <!-- Accents -->
  <circle cx="50" cy="50" r="5" fill="#E07A5F"/>
  <circle cx="550" cy="50" r="5" fill="#E07A5F"/>
  <!-- Glare -->
  <path d="M 85 50 L 155 50" stroke="rgba(255,255,255,0.7)" stroke-width="5" stroke-linecap="round"/>
  <path d="M 365 50 L 435 50" stroke="rgba(255,255,255,0.7)" stroke-width="5" stroke-linecap="round"/>
</svg>
`);

// 3. Cat-Eye Rose Gold Frame (Front View Cutout)
const CUTOUT_CATEYE_ROSE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220" width="600" height="220">
  <defs>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="50%" stop-color="#E07A5F"/>
      <stop offset="100%" stop-color="#C86446"/>
    </linearGradient>
  </defs>
  <!-- Temples -->
  <path d="M 30 55 L 5 50" stroke="url(#roseGrad)" stroke-width="10" stroke-linecap="round"/>
  <path d="M 570 55 L 595 50" stroke="url(#roseGrad)" stroke-width="10" stroke-linecap="round"/>
  <!-- Cat Eye Lenses -->
  <path d="M 45 50 C 110 15, 230 30, 260 90 C 265 160, 120 180, 60 135 C 35 110 30 70 45 50 Z" fill="rgba(251,113,133,0.12)" stroke="url(#roseGrad)" stroke-width="14"/>
  <path d="M 555 50 C 490 15, 370 30, 340 90 C 335 160, 480 180, 540 135 C 565 110 570 70 555 50 Z" fill="rgba(251,113,133,0.12)" stroke="url(#roseGrad)" stroke-width="14"/>
  <!-- Bridge -->
  <path d="M 260 85 Q 300 70 340 85" fill="none" stroke="url(#roseGrad)" stroke-width="12" stroke-linecap="round"/>
  <!-- Glare -->
  <path d="M 75 45 Q 120 30 150 55" stroke="rgba(255,255,255,0.7)" stroke-width="5" stroke-linecap="round"/>
  <path d="M 450 55 Q 480 30 525 45" stroke="rgba(255,255,255,0.7)" stroke-width="5" stroke-linecap="round"/>
</svg>
`);

// 4. Aviator Sunglasses Frame (Front View Cutout)
const CUTOUT_AVIATOR_SUNGLASSES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220" width="600" height="220">
  <defs>
    <linearGradient id="goldAviator" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="darkLens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(15,23,42,0.85)"/>
      <stop offset="100%" stop-color="rgba(30,41,59,0.9)"/>
    </linearGradient>
  </defs>
  <!-- Temples -->
  <path d="M 35 65 L 5 60" stroke="url(#goldAviator)" stroke-width="8"/>
  <path d="M 565 65 L 595 60" stroke="url(#goldAviator)" stroke-width="8"/>
  <!-- Teardrop Lenses -->
  <path d="M 70 55 C 150 35, 250 55, 250 110 C 250 175, 150 195, 85 160 C 50 135, 50 80, 70 55 Z" fill="url(#darkLens)" stroke="url(#goldAviator)" stroke-width="10"/>
  <path d="M 530 55 C 450 35, 350 55, 350 110 C 350 175, 450 195, 515 160 C 550 135, 550 80, 530 55 Z" fill="url(#darkLens)" stroke="url(#goldAviator)" stroke-width="10"/>
  <!-- Double Bridge -->
  <path d="M 245 58 L 355 58" stroke="url(#goldAviator)" stroke-width="9" stroke-linecap="round"/>
  <path d="M 250 80 Q 300 70 350 80" fill="none" stroke="url(#goldAviator)" stroke-width="8" stroke-linecap="round"/>
  <!-- Glare -->
  <path d="M 90 70 Q 150 50 190 90" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="5"/>
  <path d="M 410 90 Q 450 50 510 70" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="5"/>
</svg>
`);

// 5. Kids Silicone Flexible Frame (Front View Cutout)
const CUTOUT_KIDS_FLEXIBLE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220" width="600" height="220">
  <defs>
    <linearGradient id="kidsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <!-- Temples -->
  <path d="M 35 85 L 5 80" stroke="url(#kidsGrad)" stroke-width="16" stroke-linecap="round"/>
  <path d="M 565 85 L 595 80" stroke="url(#kidsGrad)" stroke-width="16" stroke-linecap="round"/>
  <!-- Lenses -->
  <circle cx="160" cy="110" r="85" fill="rgba(255,255,255,0.15)" stroke="url(#kidsGrad)" stroke-width="18"/>
  <circle cx="440" cy="110" r="85" fill="rgba(255,255,255,0.15)" stroke="url(#kidsGrad)" stroke-width="18"/>
  <!-- Bridge -->
  <path d="M 245 100 L 355 100" fill="none" stroke="url(#kidsGrad)" stroke-width="18" stroke-linecap="round"/>
</svg>
`);

// STORE PRODUCTS LIST (100% PURE BACKGROUND-FREE CUTOUTS & REAL STORE ITEMS)
const INITIAL_PRODUCTS = [
  // ── 1. نظارات كليب أون 2 في 1 (طبية + كليب شمسي بولارايزد مغناطيسي) ──
  {
    id: "clip-1",
    name: "نظارة كليب أون 2 في 1 تايجر عسلي + كليب بولارايزد",
    category: "clipon",
    price: 550,
    originalPrice: 890,
    shape: "square",
    gender: "unisex",
    material: "أسيتيت تايجر عسلي + كليب مغناطيسي بولارايزد",
    image: "folder_3_80_images/real_clipon_tortoise.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "🔥 كليب أون 2 في 1",
    description: "نظارة طبية وشمسية في نفس الوقت! إطار طبي أنيق بلون التايجر العسلي مع كليب شمسي مغناطيسي بعدسات بولارايزد يركب ويفك بلمسة واحدة.",
    stock: 15,
    rating: 5.0,
    reviewsCount: 45
  },
  {
    id: "clip-2",
    name: "نظارة كليب أون 2 في 1 أسيتيت شفاف مربع + كليب شمسي",
    category: "clipon",
    price: 550,
    originalPrice: 890,
    shape: "square",
    gender: "unisex",
    material: "أسيتيت شفاف كريستالي + كليب بولارايزد",
    image: "folder_3_80_images/real_clipon_square_clear.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "🔥 كليب أون 2 في 1",
    description: "تصميم عصري شفاف ناصع البياض يتحول لنظارة شمسية بولارايزد سوداء في ثانية بفضل المغناطيس القوي.",
    stock: 14,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: "clip-3",
    name: "نظارة كليب أون 2 في 1 كريستال دائري ناعم + كليب شمسي",
    category: "clipon",
    price: 550,
    originalPrice: 890,
    shape: "round",
    gender: "unisex",
    material: "أسيتيت كريستال دائري + كليب بولارايزد",
    image: "folder_3_80_images/real_clipon_round_clear.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "🔥 كليب أون 2 في 1",
    description: "إطار دائري راقي شفاف مع كليب شمسي مدمج يحميك 100% من أشعة الشمس وانعكاسات القيادة.",
    stock: 12,
    rating: 5.0,
    reviewsCount: 29
  },

  // ── 2. نظارات طبية - رجالي ──
  {
    id: "prod-new-1",
    name: "نظارة أفياتور جولد تيتانيوم دبل بريدج رجالي",
    category: "optical_men",
    price: 480,
    originalPrice: 790,
    shape: "aviator",
    gender: "men",
    material: "تيتانيوم ذهبي خفيف جداً + دبل بريدج",
    image: "folder_2_80_images/optical_aviator_gold.jpg",
    cutoutImage: CUTOUT_AVIATOR_SUNGLASSES,
    tag: "✨ تيتانيوم ذهبي",
    description: "إطار أفياتور ريترو فاخر مصنوع من التيتانيوم الخفيف بلون ذهبي لامع مع حفر ليزر 4D OPTICAL على الذراع.",
    stock: 14,
    rating: 5.0,
    reviewsCount: 32
  },
  {
    id: "prod-new-2",
    name: "نظارة سموكي جراي أسيتيت شفاف فاخر",
    category: "optical_men",
    price: 430,
    originalPrice: 690,
    shape: "square",
    gender: "men",
    material: "أسيتيت إيطالي رمادي شفاف + سلك داخلي",
    image: "folder_2_80_images/optical_smoky_gray.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "تريند 2026",
    description: "إطار مربع عصري بلون الرمادي الكريستالي الشفاف مع سلك داخلي محفور بختم 4D OPTICAL الأصلي.",
    stock: 16,
    rating: 4.9,
    reviewsCount: 27
  },
  {
    id: "prod-new-4",
    name: "نظارة كلوب ماستر تايجر هافان كلاسيك",
    category: "optical_men",
    price: 460,
    originalPrice: 750,
    shape: "square",
    gender: "men",
    material: "أسيتيت هافان تايجر + سلك ذهبي",
    image: "folder_2_80_images/optical_clubmaster_havana.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "كلوب ماستر هافان",
    description: "تصميم كلوب ماستر الكلاسيكي الراقي بلون الهافان العسلي مع مفصلات معدنية مذهبة وختم البراند الداخلي.",
    stock: 12,
    rating: 5.0,
    reviewsCount: 39
  },
  {
    id: "prod-1",
    name: "نظارة إيليفيشن تيتانيوم طبية رجالي",
    category: "optical_men",
    price: 450,
    originalPrice: 750,
    shape: "round",
    gender: "men",
    material: "تيتانيوم خفيف جداً",
    image: "folder_1_80_images/optical1.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "الأكثر مبيعاً",
    description: "إطار تيتانيوم فاخر خفيف جداً ومقاوم للصدمات باللون النحاسي والذهبي. مريحة جداً للاستخدام اليومي المستمر للرجال.",
    stock: 15,
    rating: 4.9,
    reviewsCount: 28
  },
  {
    id: "prod-2",
    name: "نظارة مات بلاك إغزيكتيف مربعة رجالي",
    category: "optical_men",
    price: 390,
    originalPrice: 650,
    shape: "square",
    gender: "men",
    material: "أسيتيت أسود مط مع برونز",
    image: "folder_5_64_images/square1.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "رجالي أنيق",
    description: "إطار مربع قوي باللون الأسود المطفي مع لمسات ذهبية نحاسية على الجوانب. خيار مثالي لرجال الأعمال والشباب.",
    stock: 18,
    rating: 4.8,
    reviewsCount: 23
  },
  {
    id: "prod-r1",
    name: "نظارة ماربل زيتي أسيتيت إيطالي رجالي",
    category: "optical_men",
    price: 420,
    originalPrice: 680,
    shape: "round",
    gender: "men",
    material: "أسيتيت زيتي ماربل مع أذرع ذهبية",
    image: "folder_3_80_images/real_emerald_acetate.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "خامات إيطالية",
    description: "إطار رخامي زيتي فخم مع مفصلات معدنية مذهبة وشكل دائري عصري يبرز ملامح الوجه.",
    stock: 11,
    rating: 4.9,
    reviewsCount: 19
  },
  {
    id: "prod-r2",
    name: "نظارة سترايبد جرين أسيتيت كلاسيك",
    category: "optical_men",
    price: 410,
    originalPrice: 660,
    shape: "square",
    gender: "men",
    material: "أسيتيت مقلم أخضر وأسود",
    image: "folder_4_80_images/real_striped_green.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "ستايل أوروبي",
    description: "نقشة مخططة باللون الأخضر والأسود بتصميم جريء ومميز يمنحك إطلالة فريدة ومختلفة.",
    stock: 9,
    rating: 4.8,
    reviewsCount: 15
  },
  {
    id: "prod-r7",
    name: "نظارة بايلوت دبل بريدج كريستال رمادي",
    category: "optical_men",
    price: 460,
    originalPrice: 720,
    shape: "aviator",
    gender: "men",
    material: "أسيتيت كريستال رمادي دبل بريدج",
    image: "folder_3_80_images/real_pilot_dark.jpg",
    cutoutImage: CUTOUT_AVIATOR_SUNGLASSES,
    tag: "بايلوت عصري",
    description: "تصميم بايلوت مزدوج الجسر أنيق ومريح للغاية للرجال الذين يفضلون الإطارات العريضة.",
    stock: 14,
    rating: 5.0,
    reviewsCount: 22
  },
  {
    id: "prod-r8",
    name: "نظارة أفياتور سترايبد كحلي عريض",
    category: "optical_men",
    price: 470,
    originalPrice: 740,
    shape: "aviator",
    gender: "men",
    material: "أسيتيت كحلي مقلم + معدن",
    image: "folder_3_80_images/real_pilot_striped.jpg",
    cutoutImage: CUTOUT_AVIATOR_SUNGLASSES,
    tag: "إطار عريض",
    description: "إطار أفياتور كحلي مقلم عريض بأعلى جودة تصنيع متانة وخفة استثنائية.",
    stock: 8,
    rating: 4.9,
    reviewsCount: 17
  },
  {
    id: "prod-r9",
    name: "نظارة تيتانيوم أزرق تايجر سداسية (IP)",
    category: "optical_men",
    price: 490,
    originalPrice: 790,
    shape: "square",
    gender: "men",
    material: "تيتانيوم IP فائق الخفة بلون أزرق تايجر",
    image: "folder_4_80_images/real_titanium_blue.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "تيتانيوم فائق الخفة",
    description: "إطار تيتانيوم هندسي سداسي فائق الخفة ومقاوم للتآكل بوزن ريشة ومظهر في غاية الأناقة.",
    stock: 16,
    rating: 5.0,
    reviewsCount: 31
  },
  {
    id: "prod-r10",
    name: "نظارة هامفريز أسيتيت أسود عريض إغزيكتيف",
    category: "optical_men",
    price: 430,
    originalPrice: 690,
    shape: "square",
    gender: "men",
    material: "أسيتيت أسود فاخر عريض",
    image: "folder_4_80_images/real_square_thick_black.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "هيبة وفخامة",
    description: "إطار أسود سميك بنقوش جانبية نحاسية تمنح حضوراً قوياً وجذاباً في المناسبات والعمل.",
    stock: 12,
    rating: 4.9,
    reviewsCount: 26
  },
  {
    id: "prod-r11",
    name: "نظارة جولد بايلوت أسود دبل بريدج",
    category: "optical_men",
    price: 450,
    originalPrice: 720,
    shape: "aviator",
    gender: "men",
    material: "أسيتيت أسود لامع + سلك معدني",
    image: "folder_2_80_images/real_black_aviator.jpg",
    cutoutImage: CUTOUT_AVIATOR_SUNGLASSES,
    tag: "أفياتور كلاسيك",
    description: "تصميم بايلوت كلاسيكي بجسرين علوي وسفلي يجمع بين الأسيتيت الأسود والمفصلات المعدنية.",
    stock: 13,
    rating: 4.8,
    reviewsCount: 20
  },
  {
    id: "prod-r12",
    name: "نظارة هاف ريم كحلي إسكندنافي فاخرة",
    category: "optical_men",
    price: 440,
    originalPrice: 700,
    shape: "round",
    gender: "men",
    material: "أسيتيت علوي كحلي + سلك ذهبي سفلي",
    image: "folder_3_80_images/real_navy_half.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "هاف ريم راقي",
    description: "إطار نصفي كحلي راقي مع سلك سفلي ذهبي خفيف الوزن ومريح جداً على الأنف.",
    stock: 10,
    rating: 4.9,
    reviewsCount: 18
  },

  // ── 3. نظارات طبية - حريمي ──
  {
    id: "prod-new-3",
    name: "نظارة كات آي أسود ملكي بأذرع ذهبية حريمي",
    category: "optical_women",
    price: 490,
    originalPrice: 820,
    shape: "cateye",
    gender: "women",
    material: "أسيتيت أسود لامع + أذرع ذهبية محفورة",
    image: "folder_2_80_images/optical_cateye_blackgold.jpg",
    cutoutImage: CUTOUT_CATEYE_ROSE,
    tag: "✨ الأكثر أناقة",
    description: "تصميم كات آي إيطالي فائق الفخامة يجمع بين الأسيتيت الأسود اللامع والأذرع الذهبية المحفورة بختم 4D OPTICAL الأصلي.",
    stock: 15,
    rating: 5.0,
    reviewsCount: 42
  },
  {
    id: "prod-3",
    name: "نظارة روز كوبر كات آي طبية حريمي",
    category: "optical_women",
    price: 490,
    originalPrice: 820,
    shape: "cateye",
    gender: "women",
    material: "معدن روز جولد مزخرف",
    image: "folder_1_80_images/cateye1.jpg",
    cutoutImage: CUTOUT_CATEYE_ROSE,
    tag: "تشكيلة حريمي",
    description: "تصميم كات آي أنثوي مميز بلون نحاسي وردي مع مفصلات مزخرفة بدقة عالية تمنحك إطلالة فريدة وجذابة.",
    stock: 12,
    rating: 4.9,
    reviewsCount: 34
  },
  {
    id: "prod-4",
    name: "نظارة نوفيلا كلاسيك ذهبية طبية حريمي",
    category: "optical_women",
    price: 380,
    originalPrice: 620,
    shape: "round",
    gender: "women",
    material: "معدن ستانلس مقاوم للصدأ",
    image: "folder_2_80_images/optical_women.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "أسعار المصنع",
    description: "تصميم كلاسيكي دائر بأذرع معدنية دقيقة وتفاصيل محفورة على الإطار. تمنحك مظهر أنيق وجذاب.",
    stock: 22,
    rating: 4.8,
    reviewsCount: 19
  },
  {
    id: "prod-r3",
    name: "نظارة فيروز ترانسبارنت أنثوية فاخرة",
    category: "optical_women",
    price: 430,
    originalPrice: 690,
    shape: "cateye",
    gender: "women",
    material: "أسيتيت فيروزي شفاف + أذرع بنقشة ملونة",
    image: "folder_4_80_images/real_turquoise_cat.jpg",
    cutoutImage: CUTOUT_CATEYE_ROSE,
    tag: "ألوان مبهجة",
    description: "إطار كات آي بلون فيروزي شفاف مشرق وأذرع بنقشات بوهيمية عصرية غاية في الجاذبية.",
    stock: 14,
    rating: 5.0,
    reviewsCount: 29
  },
  {
    id: "prod-r4",
    name: "نظارة شامبين كريستال شفاف خفيفة",
    category: "optical_women",
    price: 410,
    originalPrice: 650,
    shape: "round",
    gender: "women",
    material: "أسيتيت شامبين ناصع النقاء",
    image: "folder_2_80_images/real_champagne_crystal.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "خفيفة وناعمة",
    description: "إطار كريستالي بلون الشامبين يبرز جمال العين ومناسب لجميع ألوان البشرة والإطلالات.",
    stock: 18,
    rating: 4.9,
    reviewsCount: 24
  },
  {
    id: "prod-r5",
    name: "نظارة فيل كات آي كريستال أبيض وأسود",
    category: "optical_women",
    price: 440,
    originalPrice: 710,
    shape: "cateye",
    gender: "women",
    material: "أسيتيت علوي شفاف كريستال وسلك أسود",
    image: "folder_4_80_images/real_veil_cat.jpg",
    cutoutImage: CUTOUT_CATEYE_ROSE,
    tag: "كات آي كريستال",
    description: "إطار كات آي علوي كريستالي مزخرف وسلك سفلي أسود خفيف الوزن يمنح العين سحباً أنثوياً مميزاً.",
    stock: 11,
    rating: 4.9,
    reviewsCount: 21
  },
  {
    id: "prod-r6",
    name: "نظارة ريترو تو تون عسلي ونبيتي",
    category: "optical_women",
    price: 420,
    originalPrice: 670,
    shape: "square",
    gender: "women",
    material: "أسيتيت عسلي ونبيتي بمفصلات مرنة",
    image: "folder_4_80_images/real_retro_twotone.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "ريترو شيك",
    description: "مزيج لوني راقي بين النبيتي والعسلي بتصميم ريترو كلاسيكي ومفصلات مرنة مريحة.",
    stock: 13,
    rating: 4.8,
    reviewsCount: 16
  },

  // ── 4. نظارات شمسية - رجالي ──
  {
    id: "prod-new-5",
    name: "نظارة أفياتور كربون فايبر بولارايزد شمسية رجالي",
    category: "sunglasses_men",
    price: 520,
    originalPrice: 880,
    shape: "aviator",
    gender: "men",
    material: "كربون فايبر أسود مطفي + عدسات بولارايزد UV400",
    image: "folder_5_64_images/sunglasses_carbon_pilot.jpg",
    cutoutImage: CUTOUT_AVIATOR_SUNGLASSES,
    tag: "🔥 كربون فايبر",
    description: "إطار أفياتور كربون فايبر فائق المتانة والخفة مع عدسات بولارايزد عالية النقاء محفورة بختم 4D OPTICAL.",
    stock: 15,
    rating: 5.0,
    reviewsCount: 47
  },
  {
    id: "prod-7",
    name: "نظارة كلوب ماستر كلاسيك بولارايزد رجالي",
    category: "sunglasses_men",
    price: 440,
    originalPrice: 750,
    shape: "square",
    gender: "men",
    material: "أسيتيت أسود لامع + سلك معدني ذهبي",
    image: "folder_1_80_images/clubmaster.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "الأكثر طلباً — كلوب ماستر",
    description: "تصميم كلوب ماستر الكلاسيكي الشهير بإطار علوي أسيتيت أسود وسلك ذهبي سفلي مع عدسات بولارايزد عالية النقاء لحماية العين 100% من أشعة الشمس.",
    stock: 16,
    rating: 5.0,
    reviewsCount: 48
  },
  {
    id: "prod-sun-1",
    name: "نظارة أفياتور جولد بولارايزد شمسية رجالي",
    category: "sunglasses_men",
    price: 430,
    originalPrice: 720,
    shape: "aviator",
    gender: "men",
    material: "سبائك ذهبية + عدسات بولارايزد UV400",
    image: "folder_5_64_images/sunglasses1.jpg",
    cutoutImage: CUTOUT_AVIATOR_SUNGLASSES,
    tag: "حماية UV400",
    description: "عدسات بولارايزد تحمي عينيك 100% من الأشعة فوق البنفسجية وتمنع الانعكاسات المزعجة أثناء القيادة.",
    stock: 14,
    rating: 5.0,
    reviewsCount: 36
  },

  // ── 5. نظارات شمسية - حريمي ──
  {
    id: "prod-new-6",
    name: "نظارة شمس هوني أوفرسايز حريمي عسلي فاخرة",
    category: "sunglasses_women",
    price: 510,
    originalPrice: 870,
    shape: "square",
    gender: "women",
    material: "أسيتيت هوني عسلي متدرج + عدسات UV400",
    image: "folder_5_64_images/sunglasses_oversized_honey.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "✨ فاشون أوفرسايز",
    description: "إطار عريض راقي بلون العسلي الشفاف المتدرج مع عدسات بنية شمسية وحفر ليزر 4D OPTICAL على الذراع.",
    stock: 14,
    rating: 5.0,
    reviewsCount: 39
  },
  {
    id: "prod-8",
    name: "نظارة كوين جولد كات آي شمسية حريمي",
    category: "sunglasses_women",
    price: 460,
    originalPrice: 780,
    shape: "cateye",
    gender: "women",
    material: "إطار معدني ذهبي وشمسية فاخرة",
    image: "folder_5_64_images/sunglasses_women.jpg",
    cutoutImage: CUTOUT_CATEYE_ROSE,
    tag: "شمسية حريمي فاخرة",
    description: "عدسات شمسية تظليل فاخر لحماية كاملة من الشمس مع مظهر أنثوي جذاب ومتألق.",
    stock: 10,
    rating: 4.9,
    reviewsCount: 27
  },
  {
    id: "prod-sun-w1",
    name: "نظارة شمس كابا مربع فاخر تدرج وردي وموف",
    category: "sunglasses_women",
    price: 490,
    originalPrice: 850,
    shape: "square",
    gender: "women",
    material: "أسيتيت أسود سميك + عدسات تدرج وردي/موف UV400",
    image: "folder_5_64_images/real_women_square_pink.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "فاشون وموضة",
    description: "إطار مربع كبير أسود لامع مع عدسات متدرجة باللون الوردي والموف تمنحك إطلالة النجمات وحماية كاملة.",
    stock: 12,
    rating: 5.0,
    reviewsCount: 38
  },
  {
    id: "prod-sun-w2",
    name: "نظارة شمس كات آي هندسي أسود فاخر",
    category: "sunglasses_women",
    price: 480,
    originalPrice: 820,
    shape: "cateye",
    gender: "women",
    material: "أسيتيت أسود بحواف هندسية وعدسات زيتوني تدرج",
    image: "folder_4_80_images/real_women_geometric_cat.jpg",
    cutoutImage: CUTOUT_CATEYE_ROSE,
    tag: "أحدث صيحة",
    description: "تصميم كات آي جريء بحواف مضلعة ولمسات مذهبة على الجوانب وعدسات زيتونية تدرج راقية.",
    stock: 11,
    rating: 4.9,
    reviewsCount: 29
  },
  {
    id: "prod-sun-w3",
    name: "نظارة شمس تايجر عسلي متدرج فخمة",
    category: "sunglasses_women",
    price: 490,
    originalPrice: 840,
    shape: "square",
    gender: "women",
    material: "أسيتيت هافان تايجر عسلي وعدسات عنبرية تدرج",
    image: "folder_4_80_images/real_women_square_amber.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "تايجر ملكي",
    description: "إطار عريض بلون الهافان التايجر العسلي مع عدسات عنبرية متدرجة تضفي دفئاً وأناقة لا تقاوم.",
    stock: 15,
    rating: 5.0,
    reviewsCount: 42
  },

  // ── 6. عدسات لاصقة ملونة (Colored Contact Lenses) ──
  {
    id: "lens-hazel",
    name: "عدسات 4D Color Lenses - عسلي طبيعي (Hazel)",
    category: "contact_lenses",
    price: 250,
    originalPrice: 420,
    shape: "round",
    gender: "unisex",
    material: "محتوى مائي 42% مريح للعين طوال اليوم",
    image: "folder_1_80_images/lens_hazel.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "👁️ الأكثر طلباً",
    description: "عدسات لاصقة ملونة بلون العسلي الطبيعي الدافئ بتدرج ساحر يمنح العين مظهراً طبيعياً وجذاباً. متوفرة زينة وطبية بجميع الدرجات.",
    stock: 40,
    rating: 5.0,
    reviewsCount: 65
  },
  {
    id: "lens-gray",
    name: "عدسات 4D Color Lenses - رمادي ملكي (Platinum Gray)",
    category: "contact_lenses",
    price: 250,
    originalPrice: 420,
    shape: "round",
    gender: "unisex",
    material: "محتوى مائي 42% بنفاذية أكسجين عالية",
    image: "folder_1_80_images/lens_gray.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "👁️ رمادي ملكي",
    description: "لون رمادي بلاتيني أنيق مع حلقة خارجية داكنة تبرز اتساع العين وتمنحها نظرة ساحرة وواضحة.",
    stock: 35,
    rating: 4.9,
    reviewsCount: 52
  },
  {
    id: "lens-green",
    name: "عدسات 4D Color Lenses - أخضر زمردي (Emerald Green)",
    category: "contact_lenses",
    price: 250,
    originalPrice: 420,
    shape: "round",
    gender: "unisex",
    material: "محتوى مائي 42% مع حماية UV",
    image: "folder_1_80_images/lens_green.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "👁️ أخضر زمردي",
    description: "أخضر زمردي طبيعي ناعم يمتزج بلطف مع لون العين الأصلي ليعطي إشراقة نضرة ومميزة.",
    stock: 30,
    rating: 4.9,
    reviewsCount: 41
  },
  {
    id: "lens-blue",
    name: "عدسات 4D Color Lenses - أزرق محيطي (Sapphire Blue)",
    category: "contact_lenses",
    price: 250,
    originalPrice: 420,
    shape: "round",
    gender: "unisex",
    material: "محتوى مائي 42% هيدروجيل مريح",
    image: "folder_1_80_images/lens_blue.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "👁️ أزرق محيطي",
    description: "لون أزرق ياقوتي نقي يضفي عمقاً وجاذبية فائقة على ملامح الوجه.",
    stock: 28,
    rating: 4.8,
    reviewsCount: 37
  },
  {
    id: "lens-turquoise",
    name: "عدسات 4D Color Lenses - تركواز ساحر (Aqua Turquoise)",
    category: "contact_lenses",
    price: 250,
    originalPrice: 420,
    shape: "round",
    gender: "unisex",
    material: "محتوى مائي 42% لراحة تدوم 12 ساعة",
    image: "folder_1_80_images/lens_turquoise.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "👁️ تركواز بحري",
    description: "مزيج منعش بين الأزرق والأخضر التركوازي يمنح العين بريقاً لا مثيل له.",
    stock: 25,
    rating: 5.0,
    reviewsCount: 33
  },
  {
    id: "lens-honey",
    name: "عدسات 4D Color Lenses - عسلي ذهبي (Honey Gold)",
    category: "contact_lenses",
    price: 250,
    originalPrice: 420,
    shape: "round",
    gender: "unisex",
    material: "محتوى مائي 42% فائق النعومة",
    image: "folder_1_80_images/lens_honey.jpg",
    cutoutImage: CUTOUT_ROUND_GOLD,
    tag: "👁️ عسلي ذهبي",
    description: "لون عسلي ذهبي دافئ يلائم درجات البشرة العربية ويمنح العينين دفئاً وتألقاً طبيعياً.",
    stock: 32,
    rating: 4.9,
    reviewsCount: 46
  },

  // ── 7. نظارات طبية وشمسية - أطفال ──
  {
    id: "prod-5",
    name: "نظارة كيدز سيركوس طبية أطفال (سيليكون مرن)",
    category: "optical_kids",
    price: 280,
    originalPrice: 450,
    shape: "round",
    gender: "kids",
    material: "سيليكون طبي مرن ضد الكسر",
    image: "folder_1_80_images/kids_optical.jpg",
    cutoutImage: CUTOUT_KIDS_FLEXIBLE,
    tag: "ضد الكسر للأطفال",
    description: "إطار سيليكون مريح جداً وآمن 100% للأطفال، مرن وقابل للانثناء دون أن ينكسر بألوان مبهجة تناسب الأولاد والبنات.",
    stock: 25,
    rating: 5.0,
    reviewsCount: 41
  },
  {
    id: "prod-6",
    name: "نظارة جونيور فلكس طبية خفيفة للأطفال",
    category: "optical_kids",
    price: 290,
    originalPrice: 480,
    shape: "square",
    gender: "kids",
    material: "أسيتيت مرن خفيف",
    image: "folder_1_80_images/kids_optical_2.jpg",
    cutoutImage: CUTOUT_KIDS_FLEXIBLE,
    tag: "حماية عيون الأطفال",
    description: "مصممة خصيصاً لتتحمل حركة وحيوية الأطفال أثناء اللعب والدراسة مع حماية كاملة للعين.",
    stock: 20,
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: "prod-9",
    name: "نظارة كيدز سونيك شمسية أطفال (UV400)",
    category: "sunglasses_kids",
    price: 240,
    originalPrice: 390,
    shape: "square",
    gender: "kids",
    material: "سيليكون مرن + عدسات شمسية بولارايزد",
    image: "folder_1_80_images/kids_sunglasses.jpg",
    cutoutImage: CUTOUT_KIDS_FLEXIBLE,
    tag: "شمسية أطفال مرنة",
    description: "عدسات بولارايزد ملونة تحمي عيون الأطفال من أشعة الشمس الضارة أثناء المصايف والرحلات.",
    stock: 30,
    rating: 5.0,
    reviewsCount: 33
  },

  // ── 8. بلو لايت (حماية الشاشات الرقمية) ──
  {
    id: "prod-10",
    name: "نظارة كريستال شيلد بلو لايت للشاشات",
    category: "bluelight",
    price: 350,
    originalPrice: 550,
    shape: "square",
    gender: "unisex",
    material: "أسيتيت شفاف مرن",
    image: "folder_1_80_images/bluelight1.jpg",
    cutoutImage: CUTOUT_SQUARE_BLACK,
    tag: "حماية الشاشات",
    description: "مصممة خصيصاً لمن يقضون ساعات طويلة أمام الكمبيوتر والموبايل. تقلل إجهاد العين والصداع وتصفي الضوء الأزرق الضار.",
    stock: 30,
    rating: 4.7,
    reviewsCount: 35
  }
];

const INITIAL_ORDERS = [];

const INITIAL_CUSTOMERS = [];

// Helper Functions
function getStoredProducts() {
  const data = localStorage.getItem("4d_optical_products");
  if (!data) {
    localStorage.setItem("4d_optical_products", JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

function saveStoredProducts(products) {
  localStorage.setItem("4d_optical_products", JSON.stringify(products));
}

function getStoredOrders() {
  const data = localStorage.getItem("4d_optical_orders");
  if (!data) {
    localStorage.setItem("4d_optical_orders", JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(data) || [];
  } catch (e) {
    return [];
  }
}

function saveStoredOrders(orders) {
  localStorage.setItem("4d_optical_orders", JSON.stringify(orders));
}

function getStoredCustomers() {
  const data = localStorage.getItem("4d_optical_customers");
  if (!data) {
    localStorage.setItem("4d_optical_customers", JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(data) || [];
  } catch (e) {
    return [];
  }
}

function saveStoredCustomers(customers) {
  localStorage.setItem("4d_optical_customers", JSON.stringify(customers));
}

function getCart() {
  const data = localStorage.getItem("4d_optical_cart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem("4d_optical_cart", JSON.stringify(cart));
}
