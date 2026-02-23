//! # Storage Module for Achievement Badges Contract
//!
//! This module handles all data storage operations for the badge system.

use soroban_sdk::{Address, Env, Map, String, Vec};
use crate::types::*;

/// Storage key for admin address
pub const ADMIN: &str = "ADMIN";

/// Storage key for next token ID counter
pub const NEXT_TOKEN_ID: &str = "NEXT_TOKEN_ID";

/// Storage key prefix for user badges
pub const USER_BADGES: &str = "USER_BADGES";

/// Storage key prefix for minted badges (to prevent duplicates)
pub const MINTED_BADGES: &str = "MINTED_BADGES";

/// Set the admin address
pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().persistent().set(&ADMIN, admin);
}

/// Get the admin address
pub fn get_admin(env: &Env) -> Address {
    env.storage().persistent().get(&ADMIN).unwrap()
}

/// Check if admin is set
pub fn has_admin(env: &Env) -> bool {
    env.storage().persistent().has(&ADMIN)
}

/// Get the next token ID and increment the counter
pub fn get_next_token_id(env: &Env) -> String {
    let current_id = env.storage().persistent().get(&NEXT_TOKEN_ID).unwrap_or(0u64);
    let next_id = current_id + 1;
    env.storage().persistent().set(&NEXT_TOKEN_ID, &next_id);
    format!("{}", current_id + 1)
}

/// Check if a user has already minted a specific badge
pub fn has_minted_badge(env: &Env, user: &Address, badge_type: &BadgeType) -> bool {
    let key = (MINTED_BADGES, user, badge_type);
    env.storage().persistent().has(&key)
}

/// Mark a badge as minted for a user
pub fn set_minted_badge(env: &Env, user: &Address, badge_type: &BadgeType) {
    let key = (MINTED_BADGES, user, badge_type);
    env.storage().persistent().set(&key, &true);
}

/// Add a badge to user's collection
pub fn add_user_badge(env: &Env, user: &Address, badge: &UserBadge) {
    let key = (USER_BADGES, user);
    let mut badges: Vec<UserBadge> = env.storage().persistent().get(&key).unwrap_or(Vec::new(env));
    badges.push_back(badge.clone());
    env.storage().persistent().set(&key, &badges);
}

/// Get all badges for a user
pub fn get_user_badges(env: &Env, user: &Address) -> Vec<UserBadge> {
    let key = (USER_BADGES, user);
    env.storage().persistent().get(&key).unwrap_or(Vec::new(env))
}

/// Get badge metadata for a badge type
pub fn get_badge_metadata(badge_type: &BadgeType) -> BadgeMetadata {
    match badge_type {
        BadgeType::FirstSplitCreator => BadgeMetadata {
            name: String::from_str(&Env::default(), "First Split Creator"),
            description: String::from_str(&Env::default(), "Awarded for creating your first split"),
            image_url: String::from_str(&Env::default(), "https://stellarsplit.com/badges/first-creator.png"),
            badge_type: badge_type.clone(),
        },
        BadgeType::HundredSplitsParticipated => BadgeMetadata {
            name: String::from_str(&Env::default(), "Century Club"),
            description: String::from_str(&Env::default(), "Participated in 100 splits"),
            image_url: String::from_str(&Env::default(), "https://stellarsplit.com/badges/century-club.png"),
            badge_type: badge_type.clone(),
        },
        BadgeType::BigSpender => BadgeMetadata {
            name: String::from_str(&Env::default(), "Big Spender"),
            description: String::from_str(&Env::default(), "Spent over 1000 XLM in splits"),
            image_url: String::from_str(&Env::default(), "https://stellarsplit.com/badges/big-spender.png"),
            badge_type: badge_type.clone(),
        },
        BadgeType::FrequentSettler => BadgeMetadata {
            name: String::from_str(&Env::default(), "Frequent Settler"),
            description: String::from_str(&Env::default(), "Settled 50 splits as creator"),
            image_url: String::from_str(&Env::default(), "https://stellarsplit.com/badges/frequent-settler.png"),
            badge_type: badge_type.clone(),
        },
        BadgeType::GroupLeader => BadgeMetadata {
            name: String::from_str(&Env::default(), "Group Leader"),
            description: String::from_str(&Env::default(), "Created 10 group splits"),
            image_url: String::from_str(&Env::default(), "https://stellarsplit.com/badges/group-leader.png"),
            badge_type: badge_type.clone(),
        },
    }
}