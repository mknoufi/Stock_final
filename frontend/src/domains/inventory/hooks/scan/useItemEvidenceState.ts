import { useCallback, useState } from "react";
import { Alert } from "react-native";

type DamageType = "returnable" | "nonreturnable";

export const useItemEvidenceState = () => {
  const [remark, setRemark] = useState("");
  const [varianceRemark, setVarianceRemark] = useState("");
  const [isDamageEnabled, setIsDamageEnabled] = useState(false);
  const [damageQty, setDamageQty] = useState("");
  const [damageType, setDamageType] = useState<DamageType>("returnable");
  const [damagePhoto, setDamagePhoto] = useState<string | null>(null);
  const [itemPhotos, setItemPhotos] = useState<string[]>([]);

  const handleTakeDamagePhoto = useCallback(() => {
    Alert.alert("Photo Capture", "Photo capture is not enabled.");
  }, []);

  const handleAddItemPhoto = useCallback(() => {
    Alert.alert("Photo Capture", "Photo capture is not enabled.");
  }, []);

  const removeDamagePhoto = useCallback(() => {
    setDamagePhoto(null);
  }, []);

  const removeItemPhoto = useCallback((index: number) => {
    setItemPhotos((previous) => previous.filter((_, current) => current !== index));
  }, []);

  const resetEvidenceState = useCallback(() => {
    setRemark("");
    setVarianceRemark("");
    setIsDamageEnabled(false);
    setDamageQty("");
    setDamageType("returnable");
    setDamagePhoto(null);
    setItemPhotos([]);
  }, []);

  return {
    damagePhoto,
    damageQty,
    damageType,
    handleAddItemPhoto,
    handleTakeDamagePhoto,
    isDamageEnabled,
    itemPhotos,
    remark,
    removeDamagePhoto,
    removeItemPhoto,
    resetEvidenceState,
    setDamageQty,
    setDamageType,
    setIsDamageEnabled,
    setRemark,
    setVarianceRemark,
    varianceRemark,
  };
};
